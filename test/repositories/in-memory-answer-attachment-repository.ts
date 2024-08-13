import { AnswerAttachmentRepository } from '../../src/domain/forum/application/repositories/answer_attachments_repository'
import { AnswerAttachment } from '../../src/domain/forum/enterprise/entities/answer_attachment'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentRepository {
  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = answerAttachments
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const remainingAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )
    this.items = remainingAttachments
  }

  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this.items.filter((item) => item.answerId.toString() === answerId)
  }
}
