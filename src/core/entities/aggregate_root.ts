import { DomainEvent } from '../events/domain_event'
import { DomainEvents } from '../events/domain_events'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvents(_domainEvent: DomainEvent) {
    this._domainEvents.push(_domainEvent)
    DomainEvents.markAggregateForDispatch(this)
  }

  public clearEvents() {
    this._domainEvents = []
  }
}
