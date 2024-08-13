import { PaginationParams } from "@/core/repositories/pagination_params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/question_repository";
import { Question } from "@/domain/forum/enterprise/entities/question_entity";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma_question_mapper";
import { aq } from "vitest/dist/reporters-B7ebVMkT";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question_attachments_repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value_objects/comment_with_author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma_comment_with_author_mapper";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value_objects/question_details";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma_question_details_mapper";
import { DomainEvents } from "@/core/events/domain_events";
import { CacheRepository } from "@/infra/cache/cache_repository";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {

    constructor(private prismService: PrismaService,
        private cache: CacheRepository,
        private questionAttachmentsRepository: QuestionAttachmentRepository,) { }

    async create(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question)

        await this.prismService.question.create({
            data
        })

        await this.questionAttachmentsRepository.createMany(
            question.attachments.getItems(),
        )

        DomainEvents.dispatchEventsForAggregate(question.id)

    }

    async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {

        const cacheHit = await this.cache.get(`question:${slug}:details`)

        if (cacheHit) {
            const cacheData = JSON.parse(cacheHit)

            return cacheData
        }

        const question = await this.prismService.question.findUnique({
            where: {
                slug,
            },
            include: {
                author: true,
                attachments: true,
            },
        })

        if (!question) {
            return null
        }

        const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

        await this.cache.set(
            `question:${slug}:details`,
            JSON.stringify(questionDetails),
        )

        return questionDetails
    }


    async findBySlug(slug: string): Promise<Question | null> {
        const question = await this.prismService.question.findUnique({
            where: {
                slug
            }
        })

        if (!question) {
            return null;
        }

        return PrismaQuestionMapper.toDomain(question);
    }
    async findById(id: string): Promise<Question | null> {
        const question = await this.prismService.question.findUnique({
            where: {
                id
            }
        })

        if (!question) {
            return null;
        }

        return PrismaQuestionMapper.toDomain(question);
    }
    async delete(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question)

        await this.prismService.question.delete({
            where: {
                id: data.id
            }
        })
    }

    async save(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question)

        await Promise.all([
            this.prismService.question.update({
                where: {
                    id: question.id.toString(),
                },
                data,
            }),
            this.questionAttachmentsRepository.createMany(
                question.attachments.getNewItems(),
            ),
            this.questionAttachmentsRepository.deleteMany(
                question.attachments.getRemovedItems(),
            ),
            this.cache.delete(`question:${data.slug}:details`),
        ])

        DomainEvents.dispatchEventsForAggregate(question.id)

    }

    async findManyRecent({ page, }: PaginationParams): Promise<Question[]> {
        const questions = await this.prismService.question.findMany({
            orderBy: {
                createdAt: 'desc'
            },

            take: 20,
            skip: (page - 1) * 20
        })

        return questions.map(PrismaQuestionMapper.toDomain)
    }


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
}