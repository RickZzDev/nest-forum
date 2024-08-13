import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { ChooseBestQuestionAnswerUseCase } from './choose_question_best_answer'
import { makeQuestion } from 'test/factories/make_question'
import { makeAnswer } from 'test/factories/make_answer'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'

let repository: InMemoryQuestionRepository
let answerRepository: InMemoryAnswerRepository
let answerAttachemtnRepository: InMemoryAnswerAttachmentRepository
let questionAttachmentRepo: InMemoryQuestionAttachmentRepository
let useCase: ChooseBestQuestionAnswerUseCase
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentRepository

describe('Create Question', () => {
  beforeEach(() => {
    questionAttachmentRepo = new InMemoryQuestionAttachmentRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    repository = new InMemoryQuestionRepository(questionAttachmentRepo,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,)
    answerAttachemtnRepository = new InMemoryAnswerAttachmentRepository()
    answerRepository = new InMemoryAnswerRepository(answerAttachemtnRepository)
    useCase = new ChooseBestQuestionAnswerUseCase(answerRepository, repository)
  })

  it('Create best question', async () => {
    const q = makeQuestion()
    const a = makeAnswer({ questionId: q.id })

    await repository.create(q)
    await answerRepository.create(a)

    await useCase.execute({
      answerId: a.id.toString(),
      authorId: q.authorId.toString(),
    })

    expect(repository.items[0].bestAnswerId).toEqual(a.id)
  })

  it('Should not be able to create best question with diferent author id', async () => {
    const q = makeQuestion()
    const a = makeAnswer({ questionId: q.id })

    await repository.create(q)
    await answerRepository.create(a)

    const result = await useCase.execute({
      answerId: a.id.toString(),
      authorId: '2',
    })
    expect(result.isLeft()).toBe(true)
  })
})
