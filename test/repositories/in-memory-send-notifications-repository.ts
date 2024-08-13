import { NotificationsRepository } from 'src/domain/notification/application/repositories/notification_repository'
import { Notification } from 'src/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationRepository implements NotificationsRepository {
  public items: Notification[] = []
  async create(notification: Notification) {
    this.items.push(notification)
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.filter((item) => item.id.toValue() === id)

    if (!notification) {
      return null
    }

    return notification[0]
  }

  async save(notification: Notification) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === notification.id.toString(),
    )

    this.items[index] = notification
  }
}
