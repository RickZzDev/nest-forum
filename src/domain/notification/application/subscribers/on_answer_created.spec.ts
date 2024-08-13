import { makeAnswer } from 'test/factories/make_answer'
import { OnAnswerCreated } from './on_answer_created'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { describe, it, beforeEach, MockInstance, vi, expect } from 'vitest'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-send-notifications-repository'
import { SendNotificationUseCase } from '../usecases/send_notification'
import { makeQuestion } from 'test/factories/make_question'
import { waitFor } from 'test/utils/wait_for'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let questionsRepository: InMemoryQuestionRepository
let questionsAttachmentsRepo: InMemoryQuestionAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAttachmentsRepository: InMemoryAnswerAttachmentRepository
let sendNotificationRepository: InMemoryNotificationRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryStudentsRepository: InMemoryStudentRepository
let sendNotificationExecuteSpy: MockInstance
let inMemoryAttachmentsRepo: InMemoryAttachmentsRepository


describe('On answer created', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepo = new InMemoryAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAttachmentsRepository,
    )

    questionsAttachmentsRepo = new InMemoryQuestionAttachmentRepository()
    questionsRepository = new InMemoryQuestionRepository(
      questionsAttachmentsRepo,
      inMemoryAttachmentsRepo,
      inMemoryStudentsRepository,
    )
    sendNotificationRepository = new InMemoryNotificationRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      sendNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCreated(questionsRepository, sendNotificationUseCase)
  })

  it('It should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    questionsRepository.create(question)
    inMemoryAnswerRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
