import { BadRequestException, Body, Controller, HttpCode, Param, Post, Put } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CurrentUser } from '@/infra/auth/current_user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { EditAnswerUseCase } from '@/domain/forum/application/use_cases/edit_answer'

const editAnswerBodySchema = z.object({
    content: z.string(),
    attachments: z.array(z.string().uuid()).default([]),

})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
    constructor(
        private jwt: JwtService,
        private editAnswer: EditAnswerUseCase,
    ) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(new ZodValidationPipe(editAnswerBodySchema))
        body: EditAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string
    ) {
        const { content, attachments } = body

        const userId = user.sub

        const result = await this.editAnswer.execute({
            content: content,
            authorId: userId,
            attachmentIds: attachments,
            answerId
        })

        if (result.isLeft()) {
            throw new BadRequestException(result.value)
        }
    }

}
