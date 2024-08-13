import { Entity } from '../../../../../src/core/entities/entity'
import { UniqueEntityId } from '../../../../../src/core/entities/unique_entity_id'
import { Optional } from '../../../../../src/core/types/optional'

export interface NotificationProps {
  receiverId: UniqueEntityId
  title: string
  content: string
  createdAt: Date
  readAt?: Date | null
}

export class Notification extends Entity<NotificationProps> {
  get receiverId() {
    return this.props.receiverId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get readAt() {
    return this.props.readAt
  }

  read() {
    this.props.readAt = new Date()
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return notification
  }
}
