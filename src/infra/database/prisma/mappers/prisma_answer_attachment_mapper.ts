import { UniqueEntityId } from "@/core/entities/unique_entity_id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer_attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";


export class PrismaAnswerAttachmentMapper {

    static toDomain(raw: PrismaAttachment) {

        if (!raw.answerId) {
            throw new Error('Invalid attatchment type.')
        }

        return AnswerAttachment.create(
            {
                attachmentId: new UniqueEntityId(raw.id),
                answerId: new UniqueEntityId(raw.answerId)
            },
            new UniqueEntityId(raw.id)
        )
    }

    static toPrismaUpdateMany(
        attachments: AnswerAttachment[],
    ): Prisma.AttachmentUpdateManyArgs {
        const attachmentIds = attachments.map((attachment) => {
            return attachment.attachmentId.toString()
        })

        return {
            where: {
                id: {
                    in: attachmentIds,
                },
            },
            data: {
                answerId: attachments[0].answerId.toString(),
            },
        }
    }

}