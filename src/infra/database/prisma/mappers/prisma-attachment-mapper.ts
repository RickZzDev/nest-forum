import { UniqueEntityId } from '@/core/entities/unique_entity_id'
import { Attachtment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachtment {
    return Attachtment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityId(raw.id),
    )
  }


  static toPrisma(
    attachment: Attachtment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
