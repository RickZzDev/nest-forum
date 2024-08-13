import { it, expect, describe, beforeEach } from 'vitest'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { DeleteAnswerUseCase } from './delete_answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make_answer'
import { Left } from '../../../../../src/core/either'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make_answer_atachement'

let repository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let useCase: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    repository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    useCase = new DeleteAnswerUseCase(repository)
  })

  it('Delete a answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('2') },
      new UniqueEntityId('1'),
    )
    await repository.create(newAnswer)

    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('3'),
      }),
    )
    await useCase.execute({
      id: '1',
      authorId: '2',
    })

    expect(repository.items.length).toEqual(0)
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0)
  })

  it('Should not be able to delete a answer from another user', async () => {
    await repository.create(makeAnswer({ authorId: new UniqueEntityId('2') }))

    const reason = await useCase.execute({
      id: '1',
      authorId: '3',
    })

    expect(reason).instanceOf(Left)
  })
})
