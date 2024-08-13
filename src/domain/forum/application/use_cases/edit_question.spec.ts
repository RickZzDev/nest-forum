import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { makeQuestion } from 'test/factories/make_question'
import { EditQuestionUseCase } from './edit_question'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make_question_atachement'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let repository: InMemoryQuestionRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository
let useCase: EditQuestionUseCase
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentRepository

describe('Edit Question', () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    repository = new InMemoryQuestionRepository(questionAttachmentRepository, inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,)
    useCase = new EditQuestionUseCase(repository, questionAttachmentRepository)
  })


  it('should sync new and removed attachment when editing a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await repository.create(newQuestion)

    questionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await useCase.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-1',
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
      attachmentIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(questionAttachmentRepository.items).toHaveLength(2)
    expect(questionAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('3'),
        }),
      ]),
    )
  })

  it('Edit a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('2') },
      new UniqueEntityId('1'),
    )
    await repository.create(newQuestion)

    questionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await useCase.execute({
      questionId: '1',
      authorId: '2',
      content: 'Content',
      title: 'title',
      attachmentIds: ['1', '3'],
    })

    expect(repository.items[0]).toMatchObject({
      content: 'Content',
      title: 'title',
    })
    expect(repository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('Should not be able to edit a question from another user', async () => {
    await repository.create(
      makeQuestion(
        { authorId: new UniqueEntityId('2') },
        new UniqueEntityId('1'),
      ),
    )

    const result = await useCase.execute({
      questionId: '1',
      authorId: '3',
      content: 'Content',
      title: 'title',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
  })
})
