import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question_comment_repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question_comment'
import { InMemoryStudentRepository } from './in-memory-students-repository'
import { PaginationParams } from '@/core/repositories/pagination_params'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value_objects/comment_with_author'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository {

  constructor(private studentsRepository: InMemoryStudentRepository) { }


  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()} does not exist."`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return questionComments
  }

  public items: QuestionComment[] = []

  async create(questioncomment: QuestionComment) {
    this.items.push(questioncomment)
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.filter(
      (item) => item.id.toValue() === id,
    )

    if (!questionComment) {
      return null
    }

    return questionComment[0]
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const index = this.items.indexOf(questionComment)

    this.items.splice(index, 1)
  }

  async findManyByQuestionId(
    questionId: string,
    page: number,
  ): Promise<QuestionComment[]> {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
  }
}
