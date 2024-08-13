import { makeQuestion } from 'test/factories/make_question'
import { AggregateRoot } from '../entities/aggregate_root'
import { UniqueEntityId } from '../entities/unique_entity_id'
import { DomainEvent } from './domain_event'
import { DomainEvents } from './domain_events'
import { describe, it, expect, vi } from 'vitest'
import { QuestionBestAnswerChosenEvent } from 'src/domain/forum/enterprise/events/question_best_answer_choosen'

class CustomAggregateCreated implements DomainEvent {
  ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggreagete = new CustomAggregate(null)

    aggreagete.addDomainEvents(new CustomAggregateCreated(aggreagete))

    return aggreagete
  }
}

describe('Domain Events', () => {
  it('Should be able to dispatch and listen events', () => {
    const callbackSpy = vi.fn()
    // Subscriber cadastrado (Temos uma função ouvindo o evento)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Evento criado, porém não foi disparado (Não foi salvo no banco)
    const aggreagete = CustomAggregate.create()

    // Assegurando que o evento foi criado mas não foi disparado
    expect(aggreagete.domainEvents).toHaveLength(1)

    // Disparando o evento (Salvamento no banco)
    DomainEvents.dispatchEventsForAggregate(aggreagete.id)

    // Assegurando que o subscriber foi chamado
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggreagete.domainEvents).toHaveLength(0)
  })

  it('Should be able to dispatch and listen events of best answer', () => {
    const callbackSpy = vi.fn()
    // Subscriber cadastrado (Temos uma função ouvindo o evento)
    DomainEvents.register(callbackSpy, QuestionBestAnswerChosenEvent.name)

    // Evento criado, porém não foi disparado (Não foi salvo no banco)
    const aggreagete = makeQuestion()
    aggreagete.bestAnswerId = new UniqueEntityId('1')

    // Assegurando que o evento foi criado mas não foi disparado
    expect(aggreagete.domainEvents).toHaveLength(1)

    // Disparando o evento (Salvamento no banco)
    DomainEvents.dispatchEventsForAggregate(aggreagete.id)

    // Assegurando que o subscriber foi chamado
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggreagete.domainEvents).toHaveLength(0)
  })
})
