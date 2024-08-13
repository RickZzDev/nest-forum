import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question_attachments_repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question_attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma_question_attachment_mapper";

@Injectable()
export class PrismaQuestionAttachmentCommentRepository implements QuestionAttachmentRepository {
    constructor(private prismService: PrismaService) { }


    async createMany(attachments: QuestionAttachment[]): Promise<void> {
        if (attachments.length === 0) {
            return
        }

        const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)
        await this.prismService.attachment.updateMany(data)
    }

    async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
        if (attachments.length === 0) {
            return
        }

        const attachmentIds = attachments.map((attachment) => {
            return attachment.id.toString()
        })

        await this.prismService.attachment.deleteMany({
            where: {
                id: {
                    in: attachmentIds,
                },
            },
        })
    }

    async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        const questionAttachments = await this.prismService.attachment.findMany({
            where: {
                questionId
            }
        })

        return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
    }


    async deleteManyByQuestionId(questionId: string): Promise<void> {
        await this.prismService.attachment.deleteMany({
            where: {
                questionId
            }
        })
    }
}