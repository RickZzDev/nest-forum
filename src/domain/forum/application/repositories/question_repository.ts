import { Question } from '../../enterprise/entities/question_entity'
import { PaginationParams } from '@/core/repositories/pagination_params'
import { QuestionDetails } from '../../enterprise/entities/value_objects/question_details'

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findById(id: string): Promise<Question | null>
  abstract delete(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>

}
