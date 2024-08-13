import { Either, left, right } from '../../../../core/either'
import { QuestionCommentRepository } from '../repositories/question_comment_repository'
import { ResourceNotFoundError } from '../../../../core/error/resource_not_found_error'
import { NotAllowedError } from '../../../../core/error/not_allowed_error'
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
export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) { }

  async execute({
    questionId,
    authorId,
  }: DeleteQuestion): Promise<CommentOnQuestionstionCommentResponse> {
    const question = await this.questionCommentRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError('Question not found'))
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionCommentRepository.delete(question)

    return right(null)
  }
}
