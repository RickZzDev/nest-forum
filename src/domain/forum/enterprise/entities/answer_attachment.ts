import { Entity } from '../../../../../src/core/entities/entity'
import { UniqueEntityId } from '../../../../../src/core/entities/unique_entity_id'

export interface AnswerAttachmentProps {
  answerId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(answerProps: AnswerAttachmentProps, id?: UniqueEntityId) {
    const attachment = new AnswerAttachment(answerProps, id)

    return attachment
  }
}
