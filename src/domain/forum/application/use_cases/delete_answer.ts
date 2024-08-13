import { Either, left, right } from '../../../../../src/core/either'
import { AnswerRepository } from '../repositories/answers_repository'
import { ResourceNotFoundError } from '../../../../core/error/resource_not_found_error'
import { NotAllowedError } from '../../../../core/error/not_allowed_error'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerInput {
  id: string
  authorId: string
}

type DeleteAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) { }

  async execute({
    id,
    authorId,
  }: DeleteAnswerInput): Promise<DeleteAnswerResponse> {
    const answer = await this.answerRepository.findById(id)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answerRepository.delete(answer)

    return right(null)
  }
}
