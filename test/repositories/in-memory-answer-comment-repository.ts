import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer_comment_repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer_comment'
import { InMemoryStudentRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value_objects/comment_with_author'
import { PaginationParams } from '@/core/repositories/pagination_params'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository {
  public items: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentRepository) { }


  async create(answercomment: AnswerComment) {
    this.items.push(answercomment)
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
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

    return answerComments
  }


  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.filter((item) => item.id.toValue() === id)

    if (!answerComment) {
      return null
    }

    return answerComment[0]
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const index = this.items.indexOf(answerComment)

    this.items.splice(index, 1)
  }

  async findManyByAnswerId(
    answerId: string,
    page: number,
  ): Promise<AnswerComment[]> {
    return this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
  }
}
