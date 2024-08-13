import { Answer } from '../../enterprise/entities/answer_entity'
import { AnswerRepository } from '../repositories/answers_repository'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { Either, right } from '../../../../core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer_attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer_attachemtn_list'
import { Injectable } from '@nestjs/common'

interface AnswerQuestionInput {
  authorId: string
  questionId: string
  attachmentsIds: string[]
  content: string
}

type AnswerQuestionReponse = Either<
  null,
  {
    answer: Answer
  }
>

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) { }

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionInput): Promise<AnswerQuestionReponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
    })

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)
    await this.answerRepository.create(answer)
    return right({ answer })
  }
}
