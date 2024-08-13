import { InMemoryNotificationRepository } from 'test/repositories/in-memory-send-notifications-repository'
import { it, expect, describe, beforeEach } from 'vitest'
import { ReadNotificationUseCase } from './read_notification'
import { makeNotification } from 'test/factories/make_notification'
import { UniqueEntityId } from '../../../../../src/core/entities/unique_entity_id'

let repository: InMemoryNotificationRepository
let useCase: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    repository = new InMemoryNotificationRepository()
    useCase = new ReadNotificationUseCase(repository)
  })

  it('Read a notification', async () => {
    const notification = makeNotification()
    await repository.create(notification)

    const result = await useCase.execute({
      receiverId: notification.receiverId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(repository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('Should not be read notification from another user', async () => {
    const notification = makeNotification({
      receiverId: new UniqueEntityId('01'),
    })

    await repository.create(notification)

    const reason = await useCase.execute({
      receiverId: '02',
      notificationId: notification.id.toString(),
    })

    expect(reason.isLeft()).toBe(true)
  })
})
