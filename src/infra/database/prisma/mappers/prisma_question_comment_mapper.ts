import { UniqueEntityId } from "@/core/entities/unique_entity_id";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question_comment";
import { Prisma, Comments as PrismaQuestionComment } from "@prisma/client";


export class PrismaQuestionCommentMapper {

    static toDomain(raw: PrismaQuestionComment) {
        if (!raw.questionId) {
            throw new Error('Invalid comment type.')
        }

        return QuestionComment.create(
            {
                content: raw.content,
                authorId: new UniqueEntityId(raw.authorId),
                questionId: new UniqueEntityId(raw.questionId),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityId(raw.id)
        )
    }

    static toPrisma(questioncomment: QuestionComment): Prisma.CommentsUncheckedCreateInput {
        return {
            id: questioncomment.id.toString(),
            authorId: questioncomment.authorId.toString(),
            questionId: questioncomment.questionId.toString(),
            content: questioncomment.content,
            createdAt: questioncomment.createdAt
        }
    }
}