import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer_question'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { UniqueEntityId } from '@/core/entities/unique_entity_id'

let repository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let useCase: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    repository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    useCase = new AnswerQuestionUseCase(repository)
  })

  it('Answer Question', async () => {
    const result = await useCase.execute({
      authorId: '1',
      questionId: '1',
      content: 'Nova resposta',
      attachmentsIds: ['1', '2'],
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answer.content).toEqual('Nova resposta')
    expect(result.value?.answer.attachments.currentItems).toHaveLength(2)
  })

  it('should persist attachments when creating a new answer', async () => {
    const result = await useCase.execute({
      questionId: '1',
      authorId: '1',
      content: 'Conteúdo da resposta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
      ]),
    )
  })
})
