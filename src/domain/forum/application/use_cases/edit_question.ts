import { UniqueEntityId } from '../../../../../src/core/entities/unique_entity_id'
import { Either, left, right } from '../../../../core/either'
import { QuestionAttachmentList } from '../../enterprise/entities/question_attachment_list'
import { Question } from '../../enterprise/entities/question_entity'
import { QuestionAttachmentRepository } from '../repositories/question_attachments_repository'
import { QuestionsRepository } from '../repositories/question_repository'
import { NotAllowedError } from '../../../../core/error/not_allowed_error'
import { ResourceNotFoundError } from '../../../../core/error/resource_not_found_error'
import { QuestionAttachment } from '../../enterprise/entities/question_attachment'
import { Injectable } from '@nestjs/common'

interface EditQuestionInput {
  questionId: string
  authorId: string
  title: string
  content: string
  attachmentIds: string[]
}

type EditQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionAttachmentRepositoru: QuestionAttachmentRepository,
  ) { }

  async execute({
    authorId,
    title,
    content,
    questionId,
    attachmentIds,
  }: EditQuestionInput): Promise<EditQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError('Question nof found'))
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachemtn =
      await this.questionAttachmentRepositoru.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachemtn,
    )

    const questionAttachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    questionAttachmentList.update(questionAttachments)
    question.attachments = questionAttachmentList

    question.title = title
    question.content = content

    await this.questionRepository.save(question)

    return right({ question })
  }
}
