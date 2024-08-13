import { it, expect, describe, beforeEach } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch_question_answers'
import { makeAnswer } from 'test/factories/make_answer'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let repository: InMemoryAnswerRepository
let useCase: FetchQuestionAnswersUseCase
let answerAttachemtnRepository: InMemoryAnswerAttachmentRepository

describe('Fetch Recent Question', () => {
  beforeEach(() => {
    answerAttachemtnRepository = new InMemoryAnswerAttachmentRepository()
    repository = new InMemoryAnswerRepository(answerAttachemtnRepository)
    useCase = new FetchQuestionAnswersUseCase(repository)
  })

  it('Should be able to fetch questions answers ', async () => {
    await repository.create(makeAnswer({ questionId: new UniqueEntityId('1') }))
    await repository.create(makeAnswer({ questionId: new UniqueEntityId('1') }))
    await repository.create(makeAnswer({ questionId: new UniqueEntityId('1') }))

    const result = await useCase.execute({
      questionId: '1',
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('Should be able to fetch questions answers with pagination ', async () => {
    for (let i = 1; i <= 22; i++) {
      await repository.create(
        makeAnswer({ questionId: new UniqueEntityId('1') }),
      )
    }

    const result = await useCase.execute({
      questionId: '1',
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
