import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'
import { Optional } from '../../../../core/types/optional'
import { Comment, CommentParams } from './comment'

export interface QuestionCommentParams extends CommentParams {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentParams> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentParams, 'createdAt'>,
    id?: UniqueEntityId,
  ): QuestionComment {
    const answer = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return answer
  }
}
