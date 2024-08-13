import { PaginationParams } from '@/core/repositories/pagination_params';
import { AnswerComment } from '../../enterprise/entities/answer_comment'
import { CommentWithAuthor } from '../../enterprise/entities/value_objects/comment_with_author';

export abstract class AnswerCommentRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
  abstract findById(answerCommentId: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    questionId: string,
    page: number,
  ): Promise<AnswerComment[]>
  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
}
