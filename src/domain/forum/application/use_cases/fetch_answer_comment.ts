import { Injectable } from '@nestjs/common'
import { Either, right } from '../../../../../src/core/either'
import { AnswerComment } from '../../enterprise/entities/answer_comment'
import { AnswerCommentRepository } from '../repositories/answer_comment_repository'
import { CommentWithAuthor } from '../../enterprise/entities/value_objects/comment_with_author'

interface FetchAnswerCommentInput {
  answerId: string
  page: number
}

type FetchAnswerCommentResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentUseCase {
  constructor(private answerRepository: AnswerCommentRepository) { }

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentInput): Promise<FetchAnswerCommentResponse> {
    const comments =
      await this.answerRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      )


    return right({
      comments,
    })
  }
}
