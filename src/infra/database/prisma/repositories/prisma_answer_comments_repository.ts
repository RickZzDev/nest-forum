import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer_comment_repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer_comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma_answer_comment_mapper";
import { PaginationParams } from "@/core/repositories/pagination_params";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value_objects/comment_with_author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma_comment_with_author_mapper";

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
    constructor(private prismService: PrismaService) { }


    async findManyByAnswerIdWithAuthor(
        answerId: string,
        { page }: PaginationParams,
    ): Promise<CommentWithAuthor[]> {
        const answerComments = await this.prismService.comments.findMany({
            where: {
                answerId,
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

        return answerComments.map(PrismaCommentWithAuthorMapper.toDomain)
    }


    async findById(id: string): Promise<AnswerComment | null> {
        const answerComment = await this.prismService.comments.findUnique({
            where: {
                id
            }
        })

        if (!answerComment) {
            return null;
        }

        return PrismaAnswerCommentMapper.toDomain(answerComment);
    }

    async create(answerComment: AnswerComment): Promise<void> {
        const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

        await this.prismService.comments.create({
            data
        })
    }


    async delete(answerComment: AnswerComment): Promise<void> {
        await this.prismService.comments.delete({
            where: {
                id: answerComment.id.toString()
            }
        })
    }

    async findManyByAnswerId(answerId: string, page: number): Promise<AnswerComment[]> {
        const answerComments = await this.prismService.comments.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                answerId
            },
            take: 20,
            skip: (page - 1) * 20
        })

        return answerComments.map(PrismaAnswerCommentMapper.toDomain)
    }
}