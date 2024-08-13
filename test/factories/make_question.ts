import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '../../src/core/entities/unique_entity_id'
import {
  Question,
  QuestionParams,
} from '../../src/domain/forum/enterprise/entities/question_entity'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma_question_mapper'

export function makeQuestion(
  override: Partial<QuestionParams> = {},
  id?: UniqueEntityId,
): Question {
  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return question
}


@Injectable()
export class QuestionFactory {

  constructor(private prisma: PrismaService) { }

  async makePrismaQuestion(data: Partial<QuestionParams> = {}): Promise<Question> {
    const question = makeQuestion(data)
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question)
    })
    return question
  }
}