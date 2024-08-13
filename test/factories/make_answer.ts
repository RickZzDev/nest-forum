import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '../../src/core/entities/unique_entity_id'
import {
  Answer,
  AnswerParams,
} from '../../src/domain/forum/enterprise/entities/answer_entity'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma_answer_mapper'

export function makeAnswer(
  override: Partial<AnswerParams> = {},
  id?: UniqueEntityId,
): Answer {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityId('1'),
      questionId: new UniqueEntityId('1'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return answer
}


@Injectable()
export class AnswerFactory {

  constructor(private prisma: PrismaService) { }

  async makePrismaAnswer(data: Partial<AnswerParams> = {}): Promise<Answer> {
    const Answer = makeAnswer(data)
    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(Answer)
    })
    return Answer
  }
}