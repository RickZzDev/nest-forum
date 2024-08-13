import { Injectable } from '@nestjs/common'
import { Either, right } from '../../../../core/either'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { QuestionAttachment } from '../../enterprise/entities/question_attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question_attachment_list'
import { Question } from '../../enterprise/entities/question_entity'
import { QuestionsRepository } from '../repositories/question_repository'

interface CreateQuestionInput {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionResponse = Either<null, { question: Question }>

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) { }

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionInput): Promise<CreateQuestionResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      content,
      title,
    })



    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })


    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionRepository.create(question)

    return right({
      question,
    })
  }
}
