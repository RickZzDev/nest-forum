import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make_question'
import { FetchRecentQuestionsUseCase } from './fetch_recent_questions'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'

let repository: InMemoryQuestionRepository
let useCase: FetchRecentQuestionsUseCase
let questionAttachmentRepo: InMemoryQuestionAttachmentRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentRepository

describe('Fetch Recent Question', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    questionAttachmentRepo = new InMemoryQuestionAttachmentRepository()
    repository = new InMemoryQuestionRepository(questionAttachmentRepo, inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,)
    useCase = new FetchRecentQuestionsUseCase(repository)
  })

  it('Should be able to fetch recent questions ', async () => {
    await repository.create(makeQuestion({ createdAt: new Date(2022, 0, 20) }))
    await repository.create(makeQuestion({ createdAt: new Date(2022, 0, 18) }))
    await repository.create(makeQuestion({ createdAt: new Date(2022, 0, 23) }))

    const result = await useCase.execute({
      page: 1,
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('Should be able to fetch paginated recent questions ', async () => {
    for (let i = 1; i <= 22; i++) {
      await repository.create(makeQuestion())
    }

    const reuslt = await useCase.execute({
      page: 2,
    })

    expect(reuslt.value?.questions).toHaveLength(2)
  })
})
