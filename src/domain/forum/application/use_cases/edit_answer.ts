import { Either, left, right } from '../../../../core/either'
import { Answer } from '../../enterprise/entities/answer_entity'
import { AnswerRepository } from '../repositories/answers_repository'
import { ResourceNotFoundError } from '../../../../core/error/resource_not_found_error'
import { NotAllowedError } from '../../../../core/error/not_allowed_error'
import { AnswerAttachment } from '../../enterprise/entities/answer_attachment'
import { AnswerAttachmentRepository } from '../repositories/answer_attachments_repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer_attachemtn_list'
import { UniqueEntityId } from '../../../../../src/core/entities/unique_entity_id'
import { Injectable } from '@nestjs/common'

interface EditAnswerInput {
  answerId: string
  authorId: string
  content: string
  attachmentIds: string[]
}

type EditAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerAttachmentRepository: AnswerAttachmentRepository,
  ) { }

  async execute({
    authorId,
    content,
    answerId,
    attachmentIds,
  }: EditAnswerInput): Promise<EditAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError('Answer nof found'))
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachemtn =
      await this.answerAttachmentRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachemtn,
    )

    const answerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.attachments = answerAttachmentList
    answer.content = content

    await this.answerRepository.save(answer)

    return right({ answer })
  }
}
