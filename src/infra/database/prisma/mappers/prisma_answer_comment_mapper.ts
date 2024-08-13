import { UniqueEntityId } from "@/core/entities/unique_entity_id";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer_comment";
import { Prisma, Comments as PrismaAnswerComment } from "@prisma/client";


export class PrismaAnswerCommentMapper {

    static toDomain(raw: PrismaAnswerComment) {
        if (!raw.answerId) {
            throw new Error('Invalid comment type.')
        }

        return AnswerComment.create(
            {
                content: raw.content,
                authorId: new UniqueEntityId(raw.authorId),
                answerId: new UniqueEntityId(raw.answerId),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityId(raw.id)
        )
    }

    static toPrisma(answercomment: AnswerComment): Prisma.CommentsUncheckedCreateInput {
        return {
            id: answercomment.id.toString(),
            authorId: answercomment.authorId.toString(),
            answerId: answercomment.answerId.toString(),
            content: answercomment.content,
            createdAt: answercomment.createdAt
        }
    }
}