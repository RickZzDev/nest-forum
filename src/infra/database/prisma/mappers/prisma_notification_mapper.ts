import { Notification as PrismaNotification, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique_entity_id'
import { Slug } from '@/domain/forum/enterprise/entities/value_objects/slug'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class PrismaNotificationMapper {
    static toDomain(raw: PrismaNotification): Notification {
        return Notification.create(
            {
                title: raw.title,
                content: raw.content,
                receiverId:
                    new UniqueEntityId(raw.recipientId),
                readAt: raw.readAt,
                createdAt: raw.createdAt,
            },
            new UniqueEntityId(raw.id),
        )
    }

    static toPrisma(
        notification: Notification,
    ): Prisma.NotificationUncheckedCreateInput {
        return {
            id: notification.id.toString(),
            recipientId: notification.receiverId.toString(),
            title: notification.title,
            content: notification.content,
            readAt: notification.readAt,
            createdAt: notification.createdAt,
        }
    }
}