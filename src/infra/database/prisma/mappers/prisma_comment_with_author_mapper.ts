import { Comments as PrismaComment, User as PrismaUser } from '@prisma/client'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value_objects/comment_with_author'
import { UniqueEntityId } from '@/core/entities/unique_entity_id'

type PrismaCommentWithAuthor = PrismaComment & {
    author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
    static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
        return CommentWithAuthor.create({
            commentId: new UniqueEntityId(raw.id),
            authorId: new UniqueEntityId(raw.author.id),
            author: raw.author.name,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}