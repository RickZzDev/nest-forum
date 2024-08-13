import { Either, left, right } from '../../../../../src/core/either'
import { Question } from '../../enterprise/entities/question_entity'
import { AnswerRepository } from '../repositories/answers_repository'
import { QuestionsRepository } from '../repositories/question_repository'
import { ResourceNotFoundError } from '../../../../core/error/resource_not_found_error'
import { NotAllowedError } from '../../../../core/error/not_allowed_error'
import { Injectable } from '@nestjs/common'

interface ChooseBestQuestionAnswerInput {
  authorId: string
  answerId: string
}

type ChooseBestQuestionAnswerResponse = Either<
  ResourceNotFoundError,
  { question: Question }
>

@Injectable()
export class ChooseBestQuestionAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private questionRepository: QuestionsRepository,
  ) { }

  async execute({
    authorId,
    answerId,
  }: ChooseBestQuestionAnswerInput): Promise<ChooseBestQuestionAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError('answer not found'))
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toValue(),
    )

    if (!question) {
      return left(new ResourceNotFoundError('question not found'))
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({
      question,
    })
  }
}
