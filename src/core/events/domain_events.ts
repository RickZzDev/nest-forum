import { AggregateRoot } from '../entities/aggregate_root'
import { UniqueEntityId } from '../entities/unique_entity_id'
import { DomainEvent } from './domain_event'

type DomainEventCallback = (event: unknown) => void

export class DomainEvents {
  // Subscribers, para cada chave do recrod String, temos uma function
  private static handlersMap: Record<string, DomainEventCallback[]> = {}

  // Listagem agregados que possuem eventos pendentes (ready: false)
  private static markedAggregates: AggregateRoot<unknown>[] = []

  public static shouldRun = true


  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(
      aggregate.id,
      'markAggregateForDispatch',
    )

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event))
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))

    this.markedAggregates.splice(index, 1)
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityId,
    origin: string,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  public static dispatchEventsForAggregate(id: UniqueEntityId) {
    const aggregate = this.findMarkedAggregateByID(
      id,
      'dispatchEventsForAggregate',
    )

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    } else {
    }
  }

  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = []
    }

    this.handlersMap[eventClassName].push(callback)
  }

  public static clearHandlers() {
    this.handlersMap = {}
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = []
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name
    const isEventRegistered = eventClassName in this.handlersMap

    if (!this.shouldRun) {
      return
    }

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName]

      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
