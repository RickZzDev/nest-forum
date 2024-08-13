import { Injectable } from '@nestjs/common'
import { Either, right } from '../../../../core/either'
import { Question } from '../../enterprise/entities/question_entity'
import { QuestionsRepository } from '../repositories/question_repository'

interface FetchRecentQuestionsInput {
  page: number
}

type FetchRecentQuestionsResponse = Either<
  null,
  {
    questions: Question[]
  }
>

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionsRepository) { }

  async execute({
    page,
  }: FetchRecentQuestionsInput): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    return right({
      questions,
    })
  }
}
