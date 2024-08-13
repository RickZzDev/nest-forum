import { Either, left, right } from '../../../../core/either'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { QuestionComment } from '../../enterprise/entities/question_comment'
import { QuestionCommentRepository } from '../repositories/question_comment_repository'
import { QuestionsRepository } from '../repositories/question_repository'
import { ResourceNotFoundError } from '../../../../core/error/resource_not_found_error'
import { Injectable } from '@nestjs/common'

interface CommentOnQuestionstionCommentInput {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionstionCommentResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionCommentRepository: QuestionCommentRepository,
  ) { }

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionstionCommentInput): Promise<CommentOnQuestionstionCommentResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError('Question not found'))
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    await this.questionCommentRepository.create(questionComment)

    return right({
      questionComment,
    })
  }
}
