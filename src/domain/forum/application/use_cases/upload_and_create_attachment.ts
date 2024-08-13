import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Uploader } from '../storage/uploader'
import { AttachmentsRepository } from '../repositories/attachment_repository'
import { InvalidAttachmentTypeError } from './errors/invalid_attachment_type_error'
import { Attachtment } from '../../enterprise/entities/attachment'

interface UploadAndCreateAttachmentRequest {
    fileName: string
    fileType: string
    body: Buffer
}

type UploadAndCreateAttachmentResponse = Either<
    InvalidAttachmentTypeError,
    { attachment: Attachtment }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
    constructor(
        private attachmentsRepository: AttachmentsRepository,
        private uploader: Uploader,
    ) { }

    async execute({
        fileName,
        fileType,
        body,
    }: UploadAndCreateAttachmentRequest): Promise<UploadAndCreateAttachmentResponse> {
        if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
            return left(new InvalidAttachmentTypeError(fileType))
        }

        const { url } = await this.uploader.upload({ fileName, fileType, body })

        const attachment = Attachtment.create({
            title: fileName,
            url,
        })

        await this.attachmentsRepository.create(attachment)

        return right({
            attachment,
        })
    }
}