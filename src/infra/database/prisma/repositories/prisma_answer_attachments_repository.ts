import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer_attachments_repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer_attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma_answer_attachment_mapper";

@Injectable()
export class PrismaAnswertAttachmentRepository implements AnswerAttachmentRepository {
    constructor(private prismService: PrismaService) { }

    async createMany(attachments: AnswerAttachment[]): Promise<void> {
        if (attachments.length === 0) {
            return
        }

        const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)

        await this.prismService.attachment.updateMany(data)
    }

    async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
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


    async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        const answerAttachments = await this.prismService.attachment.findMany({
            where: {
                answerId
            }
        })

        return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain)
    }


    async deleteManyByAnswerId(answerId: string): Promise<void> {
        await this.prismService.attachment.deleteMany({
            where: {
                answerId
            }
        })
    }
}