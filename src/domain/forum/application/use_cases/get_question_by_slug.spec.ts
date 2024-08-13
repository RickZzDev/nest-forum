import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { GetQuestionBySlugUseCase } from './get_question_by_slug'
import { Slug } from '../../enterprise/entities/value_objects/slug'
import { makeQuestion } from 'test/factories/make_question'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { maekStudent } from 'test/factories/make_student'
import { makeAttachment } from 'test/factories/make_attachment'
import { makeQuestionAttachment } from 'test/factories/make_question_atachement'

let repository: InMemoryQuestionRepository
let useCase: GetQuestionBySlugUseCase
let questionAttachmentRepo: InMemoryQuestionAttachmentRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentRepository


describe('Get Question', () => {
  beforeEach(() => {
    questionAttachmentRepo = new InMemoryQuestionAttachmentRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    repository = new InMemoryQuestionRepository(questionAttachmentRepo, inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,)
    useCase = new GetQuestionBySlugUseCase(repository)
  })

  it('Get a question by slug', async () => {
    const student = maekStudent({ name: 'John Doe' })

    await inMemoryStudentsRepository.create(student)

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create('example-slug')
    })

    await repository.create(newQuestion)

    const attachment = makeAttachment({
      title: 'Some attachment',
    })

    inMemoryAttachmentsRepository.items.push(attachment)

    questionAttachmentRepo.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    )

    const result = await useCase.execute({
      slug: 'example-slug',
    })

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
      }),
    })
  })
})
