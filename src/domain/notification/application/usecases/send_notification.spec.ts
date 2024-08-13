import { InMemoryNotificationRepository } from 'test/repositories/in-memory-send-notifications-repository'
import { it, expect, describe, beforeEach } from 'vitest'
import { SendNotificationUseCase } from './send_notification'

let repository: InMemoryNotificationRepository
let useCase: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    repository = new InMemoryNotificationRepository()
    useCase = new SendNotificationUseCase(repository)
  })

  it('Send a notification', async () => {
    const result = await useCase.execute({
      receiverId: '1',
      title: 'title',
      content: 'Nova notification',
    })

    expect(result.value?.notification.content).toEqual('Nova notification')
  })
})
