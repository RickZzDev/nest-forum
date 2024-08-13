import { Either, left, right } from '../../../../core/either'
import { Question } from '../../enterprise/entities/question_entity'
import { QuestionsRepository } from '../repositories/question_repository'
import { ResourceNotFoundError } from '../../../../core/error/resource_not_found_error'
import { Injectable } from '@nestjs/common'
import { QuestionDetails } from '../../enterprise/entities/value_objects/question_details'

interface GetQuestionBySlugInput {
  slug: string
}

type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails
  }
>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionsRepository) { }

  async execute({
    slug,
  }: GetQuestionBySlugInput): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionRepository.findDetailsBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError('Question not found'))
    }

    return right({
      question,
    })
  }
}
