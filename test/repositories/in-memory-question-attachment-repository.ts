import { QuestionAttachmentRepository } from '../../src/domain/forum/application/repositories/question_attachments_repository'
import { QuestionAttachment } from '../../src/domain/forum/enterprise/entities/question_attachment'

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository {
  public items: QuestionAttachment[] = []


  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const remainingAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )
    this.items = remainingAttachments
  }


  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = questionAttachments
  }


  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    return this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )
  }
}
