import { UniqueEntityId } from "@/core/entities/unique_entity_id";
import { Answer } from "@/domain/forum/enterprise/entities/answer_entity";
import { Prisma, Answer as PrismaAnswer } from "@prisma/client";


export class PrismaAnswerMapper {

    static toDomain(raw: PrismaAnswer) {
        return Answer.create(
            {
                content: raw.content,
                questionId: new UniqueEntityId(raw.questionId),
                authorId: new UniqueEntityId(raw.authorId),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityId(raw.id)
        )
    }

    static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
        return {
            id: answer.id.toString(),
            authorId: answer.authorId.toString(),
            questionId: answer.questionId.toString(),
            content: answer.content,
            createdAt: answer.createdAt
        }
    }
}