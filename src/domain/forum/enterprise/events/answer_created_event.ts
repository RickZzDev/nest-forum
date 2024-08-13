import { UniqueEntityId } from '../../../../../src/core/entities/unique_entity_id'
import { DomainEvent } from '../../../../../src/core/events/domain_event'
import { Answer } from '../entities/answer_entity'

export class AnswerCreated implements DomainEvent {
  public answer: Answer
  constructor(answer: Answer) {
    this.answer = answer
    this.ocurredAt = new Date()
  }

  ocurredAt: Date
  getAggregateId(): UniqueEntityId {
    return this.answer.id
  }
}
