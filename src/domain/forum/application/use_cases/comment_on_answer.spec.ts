import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { CommentOnAnswerstionCommentUseCase } from './comment_on_answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make_answer'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'

let answerCommentRepo: InMemoryAnswerCommentRepository
let answerRepository: InMemoryAnswerRepository
let answerAttachemtnRepository: InMemoryAnswerAttachmentRepository
let studentRepo: InMemoryStudentRepository
let useCase: CommentOnAnswerstionCommentUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    studentRepo = new InMemoryStudentRepository()
    answerAttachemtnRepository = new InMemoryAnswerAttachmentRepository()
    answerRepository = new InMemoryAnswerRepository(answerAttachemtnRepository)
    answerCommentRepo = new InMemoryAnswerCommentRepository(studentRepo)
    useCase = new CommentOnAnswerstionCommentUseCase(
      answerRepository,
      answerCommentRepo,
    )
  })

  it('Comment on answer', async () => {
    const answer = makeAnswer()
    await answerRepository.create(answer)

    await useCase.execute({
      content: 'Comment',
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
    })

    expect(answerCommentRepo.items[0].content).toEqual('Comment')
  })
})
