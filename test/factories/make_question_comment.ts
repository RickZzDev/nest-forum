import { UniqueEntityId } from '../../src/core/entities/unique_entity_id'
import { faker } from '@faker-js/faker'
import {
  QuestionComment,
  QuestionCommentParams,
} from '../../src/domain/forum/enterprise/entities/question_comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma_question_comment_mapper'

export function makeQuestionComment(
  override: Partial<QuestionCommentParams> = {},
  id?: UniqueEntityId,
): QuestionComment {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return questionComment
}

@Injectable()
export class QuestionCommentFactory {

  constructor(private prisma: PrismaService) { }

  async makePrismaQuestionComment(data: Partial<QuestionCommentParams> = {}): Promise<QuestionComment> {
    const QuestionComment = makeQuestionComment(data)
    await this.prisma.comments.create({
      data: PrismaQuestionCommentMapper.toPrisma(QuestionComment)
    })
    return QuestionComment
  }
}