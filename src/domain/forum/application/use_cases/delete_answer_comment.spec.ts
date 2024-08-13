import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { it, expect, describe, beforeEach } from 'vitest'
import { DeleteAnswerCommentUseCase } from './delete_answer_comment'
import { makeAnswerCommentt } from 'test/factories/make_answer_comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'

let answerCommentRepo: InMemoryAnswerCommentRepository
let inMemoryStudentsRepository: InMemoryStudentRepository
let useCase: DeleteAnswerCommentUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    answerCommentRepo = new InMemoryAnswerCommentRepository(
      inMemoryStudentsRepository,
    )
    useCase = new DeleteAnswerCommentUseCase(answerCommentRepo)
  })

  it('Should delete question', async () => {
    const answerComment = makeAnswerCommentt()
    await answerCommentRepo.create(answerComment)

    await useCase.execute({
      questionId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(answerCommentRepo.items).toHaveLength(0)
  })

  it('Should not delete question when authorId is different', async () => {
    const answerComment = makeAnswerCommentt()
    await answerCommentRepo.create(answerComment)
    const result = await useCase.execute({
      questionId: answerComment.id.toString(),
      authorId: '2',
    })

    expect(result.isLeft()).toBe(true)
  })
})
