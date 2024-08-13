import { it, expect, describe, beforeEach } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { FetchAnswerCommentUseCase } from './fetch_answer_comment'
import { makeAnswerCommentt } from 'test/factories/make_answer_comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { maekStudent } from 'test/factories/make_student'

let repository: InMemoryAnswerCommentRepository
let inMemoryStudentsRepository: InMemoryStudentRepository
let useCase: FetchAnswerCommentUseCase

describe('Fetch Answer comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    repository = new InMemoryAnswerCommentRepository(
      inMemoryStudentsRepository
    )

    useCase = new FetchAnswerCommentUseCase(repository)
  })

  it('Should be able to fetch questions comments ', async () => {
    const student = maekStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeAnswerCommentt({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    const comment2 = makeAnswerCommentt({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    const comment3 = makeAnswerCommentt({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    await repository.create(comment1)
    await repository.create(comment2)
    await repository.create(comment3)

    const result = await useCase.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('Should be able to fetch questions comments with pagination ', async () => {

    const student = maekStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await repository.create(
        makeAnswerCommentt({
          answerId: new UniqueEntityId('1'), authorId: student.id,
        }),
      )
    }

    const result = await useCase.execute({
      answerId: '1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
