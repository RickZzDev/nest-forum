import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { DeleteQuestionCommentUseCase } from './delete_question_comment'
import { makeQuestionComment } from 'test/factories/make_question_comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'

let questionCommentRepo: InMemoryQuestionCommentRepository
let inMemoryStudentsRepository: InMemoryStudentRepository
let useCase: DeleteQuestionCommentUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    questionCommentRepo = new InMemoryQuestionCommentRepository(
      inMemoryStudentsRepository,
    )
    useCase = new DeleteQuestionCommentUseCase(questionCommentRepo)
  })

  it('Should delete question', async () => {
    const questionComment = makeQuestionComment()
    await questionCommentRepo.create(questionComment)

    await useCase.execute({
      questionId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(questionCommentRepo.items).toHaveLength(0)
  })

  it('Should not delete question when authorId is different', async () => {
    const questionComment = makeQuestionComment()
    await questionCommentRepo.create(questionComment)

    const result = await useCase.execute({
      questionId: questionComment.id.toString(),
      authorId: '2',
    })

    expect(result.isLeft()).toBe(true)
  })
})
