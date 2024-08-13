import { Injectable } from '@nestjs/common'
import { Either, right } from '../../../../../src/core/either'
import { Answer } from '../../enterprise/entities/answer_entity'
import { AnswerRepository } from '../repositories/answers_repository'

interface FetchQuestionAnswersInput {
  questionId: string
  page: number
}

type FetchQuestionAnswersResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) { }

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersInput): Promise<FetchQuestionAnswersResponse> {
    const answers = await this.answerRepository.finbManyByQuestionId(
      questionId,
      { page },
    )

    return right({
      answers,
    })
  }
}
