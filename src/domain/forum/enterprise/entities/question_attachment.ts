import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique_entity_id'

export interface QuestionAttachmentProps {
  questionId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(questionProps: QuestionAttachmentProps, id?: UniqueEntityId) {
    const attachment = new QuestionAttachment(questionProps, id)

    return attachment
  }
}
