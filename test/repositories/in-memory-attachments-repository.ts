import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachment_repository"
import { Attachtment } from "@/domain/forum/enterprise/entities/attachment"

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
    public items: Attachtment[] = []

    async create(attachment: Attachtment) {
        this.items.push(attachment)
    }
}