import { Attachtment } from "@/domain/forum/enterprise/entities/attachment";

export class AttachmentPresenter {
    static toHTTP(attachment: Attachtment) {
        return {
            id: attachment.id.toString(),
            title: attachment.title,
            url: attachment.url,
        }
    }
}