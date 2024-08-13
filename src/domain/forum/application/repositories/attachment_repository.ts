import { Attachtment } from "../../enterprise/entities/attachment";

export abstract class AttachmentsRepository {
    abstract create(attachment: Attachtment): Promise<void>
}