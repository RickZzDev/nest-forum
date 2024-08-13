import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { AnswerComment } from '../../enterprise/entities/answer_comment'
import { AnswerRepository } from '../repositories/answers_repository'
import { AnswerCommentRepository } from '../repositories/answer_comment_repository'
import { ResourceNotFoundError } from '../../../../core/error/resource_not_found_error'
import { Either, left, right } from '../../../../core/either'
import { Injectable } from '@nestjs/common'

interface CommentOnAnswerstionCommentInput {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerstionCommentResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>
@Injectable()
export class CommentOnAnswerstionCommentUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerCommentRepository: AnswerCommentRepository,
  ) { }

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerstionCommentInput): Promise<CommentOnAnswerstionCommentResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    })

    await this.answerCommentRepository.create(answerComment)

    return right({
      answerComment,
    })
  }
}
