import { PaginationParams } from '@/core/repositories/pagination_params';
import { QuestionComment } from '../../enterprise/entities/question_comment'
import { CommentWithAuthor } from '../../enterprise/entities/value_objects/comment_with_author';

export abstract class QuestionCommentRepository {
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract delete(questionComment: QuestionComment): Promise<void>
  abstract findManyByQuestionId(
    questionId: string,
    page: number,
  ): Promise<QuestionComment[]>
  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
}
