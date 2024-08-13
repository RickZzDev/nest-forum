import { Slug } from './value_objects/slug'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { Optional } from '../../../../core/types/optional'
import dayjs from 'dayjs'
import { AggregateRoot } from '../../../../core/entities/aggregate_root'
import { QuestionAttachmentList } from './question_attachment_list'
import { QuestionBestAnswerChosenEvent } from '../events/question_best_answer_choosen'

export interface QuestionParams {
  title: string
  bestAnswerId?: UniqueEntityId | null
  content: string
  authorId: UniqueEntityId
  attachments: QuestionAttachmentList
  slug: Slug
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionParams> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get title() {
    return this.props.title
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get slug() {
    return this.props.slug
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  set title(value: string) {
    this.props.title = value
    this.props.slug = Slug.createFromText(value)
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined | null) {
    if (bestAnswerId === undefined) {
      return
    }

    if (
      bestAnswerId && bestAnswerId !== this.props.bestAnswerId
    ) {
      this.addDomainEvents(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId),
      )
    }

    this.props.bestAnswerId = bestAnswerId

    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionParams, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId,
  ): Question {
    const question = new Question(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    )

    return question
  }
}
