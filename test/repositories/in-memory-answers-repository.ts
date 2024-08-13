import { PaginationParams } from '../../src/core/repositories/pagination_params'
import { AnswerRepository } from '../../src/domain/forum/application/repositories/answers_repository'
import { Answer } from '../../src/domain/forum/enterprise/entities/answer_entity'
import { AnswerAttachmentRepository } from '../../src/domain/forum/application/repositories/answer_attachments_repository'
import { DomainEvents } from '../../src//core/events/domain_events'

export class InMemoryAnswerRepository implements AnswerRepository {
  constructor(private answerAttachmentRepository: AnswerAttachmentRepository) { }

  public items: Answer[] = []

  async create(answer: Answer) {
    this.items.push(answer)

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )
    this.items.splice(index, 1)
    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async save(answer: Answer): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )

    this.items[index] = answer
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async finbManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
    return answers
  }
}
