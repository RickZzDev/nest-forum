import { ResourceNotFoundError } from 'src/core/error/resource_not_found_error'
import { Either, left, right } from '../../../../core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notification_repository'
import { NotAllowedError } from 'src/core/error/not_allowed_error'
import { Inject, Injectable } from '@nestjs/common'

interface ReadNotificationInput {
  notificationId: string
  receiverId: string
}

type ReadNotificationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>
@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) { }

  async execute({
    notificationId,
    receiverId,
  }: ReadNotificationInput): Promise<ReadNotificationResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (notification.receiverId.toString() !== receiverId) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationRepository.save(notification)

    return right({
      notification,
    })
  }
}
