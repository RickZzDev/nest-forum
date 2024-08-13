import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { makeQuestion } from 'test/factories/make_question'
import { DeleteQuestionUseCase } from './delete_question'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make_question_atachement'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'

let repository: InMemoryQuestionRepository
let questionAttachmentRepo: InMemoryQuestionAttachmentRepository
let useCase: DeleteQuestionUseCase
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentRepository

describe('Delete Question', () => {
  beforeEach(() => {
    questionAttachmentRepo = new InMemoryQuestionAttachmentRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    repository = new InMemoryQuestionRepository(questionAttachmentRepo, inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,)
    useCase = new DeleteQuestionUseCase(repository)
  })

  it('Delete a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('2') },
      new UniqueEntityId('1'),
    )
    await repository.create(newQuestion)

    questionAttachmentRepo.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('3'),
      }),
    )

    await useCase.execute({
      questionId: '1',
      authorId: '2',
    })

    expect(repository.items.length).toEqual(0)
    expect(questionAttachmentRepo.items).toHaveLength(0)
  })

  it('Should not be able to delete a question from another user', async () => {
    await repository.create(
      makeQuestion(
        { authorId: new UniqueEntityId('2') },
        new UniqueEntityId('1'),
      ),
    )

    const result = await useCase.execute({
      questionId: '1',
      authorId: '3',
    })
    await expect(result.isLeft()).toBe(true)
  })
})
