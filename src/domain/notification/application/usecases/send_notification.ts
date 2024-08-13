import { Injectable } from '@nestjs/common'
import { Either, right } from '../../../../core/either'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notification_repository'

interface SendNotificationInput {
  receiverId: string
  title: string
  content: string
}

type SendNotificationResponse = Either<null, { notification: Notification }>

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) { }

  async execute({
    receiverId,
    title,
    content,
  }: SendNotificationInput): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      receiverId: new UniqueEntityId(receiverId),
      content,
      title,
    })

    await this.notificationRepository.create(notification)
    return right({
      notification,
    })
  }
}
