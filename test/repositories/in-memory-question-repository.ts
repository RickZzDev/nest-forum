import { QuestionDetails } from '@/domain/forum/enterprise/entities/value_objects/question_details'
import { DomainEvents } from 'src/core/events/domain_events'
import { PaginationParams } from 'src/core/repositories/pagination_params'
import { QuestionAttachmentRepository } from 'src/domain/forum/application/repositories/question_attachments_repository'
import { QuestionsRepository } from 'src/domain/forum/application/repositories/question_repository'
import { Question } from 'src/domain/forum/enterprise/entities/question_entity'
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentRepository } from './in-memory-students-repository'

export class InMemoryQuestionRepository implements QuestionsRepository {
  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentRepository,) { }

  public items: Question[] = []
  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async delete(question: Question): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    this.items.splice(index, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist.`,
      )
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id)
      },
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments: attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }


  async save(question: Question) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    this.items[index] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)
    return questions
  }
}
