import { PaginationParams } from "@/core/repositories/pagination_params";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers_repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer_entity";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma_answer_mapper";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer_attachments_repository";
import { DomainEvents } from "@/core/events/domain_events";

@Injectable()
export class PrismaAnswertRepository implements AnswerRepository {

    constructor(private prismService: PrismaService,
        private answerAttachmentsRepository: AnswerAttachmentRepository,
    ) { }

    async create(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPrisma(answer)

        await this.prismService.answer.create({
            data
        })

        await this.answerAttachmentsRepository.createMany(
            answer.attachments.getItems(),
        )

        DomainEvents.dispatchEventsForAggregate(answer.id)

    }

    async findById(id: string): Promise<Answer | null> {
        const answer = await this.prismService.answer.findUnique({
            where: {
                id
            }
        })

        if (!answer) {
            return null;
        }

        return PrismaAnswerMapper.toDomain(answer);
    }

    async delete(answer: Answer): Promise<void> {

        await this.prismService.answer.delete({
            where: {
                id: answer.id.toString()
            }
        })
    }
    async save(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPrisma(answer)

        await Promise.all([
            this.prismService.answer.update({
                where: {
                    id: answer.id.toString(),
                },
                data,
            }),
            this.answerAttachmentsRepository.createMany(
                answer.attachments.getNewItems(),
            ),
            this.answerAttachmentsRepository.deleteMany(
                answer.attachments.getRemovedItems(),
            ),
        ])

        DomainEvents.dispatchEventsForAggregate(answer.id)

    }

    async finbManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
        const answers = await this.prismService.answer.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                questionId
            },
            take: 20,
            skip: (page - 1) * 20
        })

        return answers.map(PrismaAnswerMapper.toDomain)
    }
}