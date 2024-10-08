import {
    Question as PrismaQuestion,
    User as PrismaUser,
    Attachment as PrismaAttachment,
} from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique_entity_id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value_objects/question_details'
import { Slug } from '@/domain/forum/enterprise/entities/value_objects/slug'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
    author: PrismaUser
    attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
    static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
        return QuestionDetails.create({
            questionId: new UniqueEntityId(raw.id),
            authorId: new UniqueEntityId(raw.author.id),
            author: raw.author.name,
            title: raw.title,
            slug: Slug.create(raw.slug),
            attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
            bestAnswerId: raw.bestAnswerId
                ? new UniqueEntityId(raw.bestAnswerId)
                : null,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}