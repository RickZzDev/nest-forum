import { PaginationParams } from '@/core/repositories/pagination_params'
import { Answer } from '../../enterprise/entities/answer_entity'

export abstract class AnswerRepository {
  abstract create(answer: Answer): Promise<void>
  abstract findById(id: string): Promise<Answer | null>
  abstract delete(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
  abstract finbManyByQuestionId(
    questionId: string,
    paginationParams: PaginationParams,
  ): Promise<Answer[]>
}
