import { Injectable } from '@nestjs/common'
import { Either, right } from '../../../../../src/core/either'
import { QuestionComment } from '../../enterprise/entities/question_comment'
import { QuestionCommentRepository } from '../repositories/question_comment_repository'
import { CommentWithAuthor } from '../../enterprise/entities/value_objects/comment_with_author'

interface FetchQuestionCommentInput {
  questionId: string
  page: number
}

type FetchQuestionCommentResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionCommentUseCase {
  constructor(private questionRepository: QuestionCommentRepository) { }

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentInput): Promise<FetchQuestionCommentResponse> {
    const comments =
      await this.questionRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      )
    return right({
      comments,
    })
  }
}
