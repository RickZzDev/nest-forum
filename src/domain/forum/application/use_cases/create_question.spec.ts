import { CreateQuestionUseCase } from './create_question'
import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { UniqueEntityId } from '@/core/entities/unique_entity_id'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let repository: InMemoryQuestionRepository
let attachmentRepository: InMemoryQuestionAttachmentRepository
let useCase: CreateQuestionUseCase
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentRepository


describe('Create Question', () => {
  beforeEach(() => {
    attachmentRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    repository = new InMemoryQuestionRepository(attachmentRepository, inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,)
    useCase = new CreateQuestionUseCase(repository)
  })


  it('should persist attachments when creating a new question', async () => {
    const result = await useCase.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(attachmentRepository.items).toHaveLength(2)
    expect(attachmentRepository.items).toEqual(
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

  it('Create a question', async () => {
    const result = await useCase.execute({
      authorId: '1',
      title: 'title',
      content: 'Nova question',
      attachmentsIds: ['1', '2'],
    })

    expect(result.value?.question.content).toEqual('Nova question')
    expect(result.value?.question.attachments.currentItems).toHaveLength(2)
  })
})
