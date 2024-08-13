import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question_comment_repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question_comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma_question_comment_mapper";
import { PaginationParams } from "@/core/repositories/pagination_params";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value_objects/comment_with_author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma_comment_with_author_mapper";

@Injectable()
export class PrismaQuestionsCommentRepository implements QuestionCommentRepository {

    constructor(private prismService: PrismaService) { }


    async findManyByQuestionIdWithAuthor(
        questionId: string,
        { page }: PaginationParams,
    ): Promise<CommentWithAuthor[]> {
        const questionComments = await this.prismService.comments.findMany({
            where: {
                questionId,
            },
            include: {
                author: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        })

        return questionComments.map(PrismaCommentWithAuthorMapper.toDomain)
    }



    async findById(id: string): Promise<QuestionComment | null> {
        const questionComment = await this.prismService.comments.findUnique({
            where: {
                id
            }
        })

        if (!questionComment) {
            return null;
        }

        return PrismaQuestionCommentMapper.toDomain(questionComment);
    }

    async create(questionComment: QuestionComment): Promise<void> {
        const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

        await this.prismService.comments.create({
            data
        })
    }


    async delete(questionComment: QuestionComment): Promise<void> {
        await this.prismService.comments.delete({
            where: {
                id: questionComment.id.toString()
            }
        })
    }

    async findManyByQuestionId(questionId: string, page: number): Promise<QuestionComment[]> {
        const questions = await this.prismService.comments.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                questionId
            },
            take: 20,
            skip: (page - 1) * 20
        })

        return questions.map(PrismaQuestionCommentMapper.toDomain)
    }
}