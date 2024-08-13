import {
  Notification,
  NotificationProps,
} from '../../src/domain/notification/enterprise/entities/notification'
import { UniqueEntityId } from '../../src/core/entities/unique_entity_id'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma_notification_mapper'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId,
): Notification {
  const notification = Notification.create(
    {
      receiverId: new UniqueEntityId('1'),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  )

  return notification
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    })

    return notification
  }
}