import {
  AnswerComment,
  AnswerCommentParams,
} from '../../src/domain/forum/enterprise/entities/answer_comment'
import { UniqueEntityId } from '../../src/core/entities/unique_entity_id'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma_answer_comment_mapper'

export function makeAnswerCommentt(
  override: Partial<AnswerCommentParams> = {},
  id?: UniqueEntityId,
): AnswerComment {
  const answerCommentt = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return answerCommentt
}


@Injectable()
export class AnswerCommentFactory {

  constructor(private prisma: PrismaService) { }

  async makePrismaAnswerComment(data: Partial<AnswerCommentParams> = {}): Promise<AnswerComment> {
    const AnswerComment = makeAnswerCommentt(data)
    await this.prisma.comments.create({
      data: PrismaAnswerCommentMapper.toPrisma(AnswerComment)
    })
    return AnswerComment
  }
}