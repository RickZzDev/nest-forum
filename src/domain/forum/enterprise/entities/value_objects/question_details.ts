import { UniqueEntityId } from '@/core/entities/unique_entity_id'
import { ValueObject } from '@/core/entities/value_object'
import { Slug } from './slug'
import { Attachtment } from '../attachment'

export interface QuestionDetailsProps {
    questionId: UniqueEntityId
    authorId: UniqueEntityId
    author: string
    title: string
    content: string
    slug: Slug
    attachments: Attachtment[]
    bestAnswerId?: UniqueEntityId | null
    createdAt: Date
    updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
    get questionId() {
        return this.props.questionId
    }

    get authorId() {
        return this.props.authorId
    }

    get author() {
        return this.props.author
    }

    get title() {
        return this.props.title
    }

    get content() {
        return this.props.content
    }

    get slug() {
        return this.props.slug
    }

    get attachments() {
        return this.props.attachments
    }

    get bestAnswerId() {
        return this.props.bestAnswerId
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    static create(props: QuestionDetailsProps) {
        return new QuestionDetails(props)
    }
}