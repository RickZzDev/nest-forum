import { UniqueEntityId } from "@/core/entities/unique_entity_id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question_attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";


export class PrismaQuestionAttachmentMapper {

    static toDomain(raw: PrismaAttachment) {

        if (!raw.questionId) {
            throw new Error('Invalid attatchment type.')
        }

        return QuestionAttachment.create(
            {
                attachmentId: new UniqueEntityId(raw.id),
                questionId: new UniqueEntityId(raw.questionId)
            },
            new UniqueEntityId(raw.id)
        )
    }

    static toPrismaUpdateMany(
        attachments: QuestionAttachment[],
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
                questionId: attachments[0].questionId.toString(),
            },
        }
    }

}