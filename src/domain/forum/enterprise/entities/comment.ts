import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'

export interface CommentParams {
  authorId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export abstract class Comment<
  Props extends CommentParams,
> extends Entity<Props> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
