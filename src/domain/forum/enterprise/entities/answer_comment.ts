import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { Optional } from '../../../../core/types/optional'
import { Comment, CommentParams } from './comment'

export interface AnswerCommentParams extends CommentParams {
  answerId: UniqueEntityId
}

export class AnswerComment extends Comment<AnswerCommentParams> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentParams, 'createdAt'>,
    id?: UniqueEntityId,
  ): AnswerComment {
    const answer = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return answer
  }
}
