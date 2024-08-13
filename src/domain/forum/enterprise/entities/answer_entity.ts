import { AggregateRoot } from '../../../../../src/core/entities/aggregate_root'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { Optional } from '../../../../core/types/optional'
import { AnswerAttachmentList } from './answer_attachemtn_list'
import { AnswerCreated } from '../events/answer_created_event'

export interface AnswerParams {
  content: string
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  attachments: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Answer extends AggregateRoot<AnswerParams> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get attachments() {
    return this.props.attachments
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  set attachments(value: AnswerAttachmentList) {
    this.props.attachments = value
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AnswerParams, 'createdAt' | 'attachments'>,
    id?: UniqueEntityId,
  ): Answer {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvents(new AnswerCreated(answer))
    }

    return answer
  }
}
