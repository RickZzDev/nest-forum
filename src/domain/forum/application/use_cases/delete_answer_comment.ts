import { Either, left, right } from '../../../../core/either'
import { AnswerCommentRepository } from '../repositories/answer_comment_repository'
import { NotAllowedError } from '../../../../core/error/not_allowed_error'
import { ResourceNotFoundError } from '../../../../core/error/resource_not_found_error'
import { Injectable } from '@nestjs/common'

interface DeleteQuestion {
  authorId: string
  questionId: string
}

type CommentOnQuestionstionCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) { }

  async execute({
    questionId,
    authorId,
  }: DeleteQuestion): Promise<CommentOnQuestionstionCommentResponse> {
    const question = await this.answerCommentRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentRepository.delete(question)

    return right(null)
  }
}
