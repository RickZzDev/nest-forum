import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make_question'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { CommentOnQuestionUseCase } from './comment_on_question'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let repository: InMemoryQuestionRepository
let questionCommentRepo: InMemoryQuestionCommentRepository
let questionAttachmentRepo: InMemoryQuestionAttachmentRepository
let useCase: CommentOnQuestionUseCase
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentRepository

describe('Comment on Question', () => {
  beforeEach(() => {
    questionAttachmentRepo = new InMemoryQuestionAttachmentRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    repository = new InMemoryQuestionRepository(questionAttachmentRepo, inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,)
    questionCommentRepo = new InMemoryQuestionCommentRepository(inMemoryStudentsRepository)
    useCase = new CommentOnQuestionUseCase(
      repository,
      questionCommentRepo,
    )
  })

  it('Comment on question', async () => {
    const question = makeQuestion()
    await repository.create(question)

    await useCase.execute({
      content: 'Comment',
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
    })

    expect(questionCommentRepo.items[0].content).toEqual('Comment')
  })
})
