import { faker } from '@faker-js/faker'


import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'
import { Attachtment, AttachtmentProps } from '@/domain/forum/enterprise/entities/attachment'
import { UniqueEntityId } from '@/core/entities/unique_entity_id'

export function makeAttachment(
    override: Partial<AttachtmentProps> = {},
    id?: UniqueEntityId,
): Attachtment {
    const attachment = Attachtment.create(
        {
            title: faker.lorem.slug(),
            url: faker.lorem.slug(),
            ...override,
        },
        id,
    )

    return attachment
}

@Injectable()
export class AttachmentFactory {
    constructor(private prisma: PrismaService) { }

    async makePrismaAttachment(
        data: Partial<AttachtmentProps> = {},
    ): Promise<Attachtment> {
        const attachment = makeAttachment(data)

        await this.prisma.attachment.create({
            data: PrismaAttachmentMapper.toPrisma(attachment),
        })

        return attachment
    }
}