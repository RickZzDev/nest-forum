import { BadRequestException, Body, Controller, HttpCode, Param, Post, Put } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CurrentUser } from '@/infra/auth/current_user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { EditQuestionUseCase } from '@/domain/forum/application/use_cases/edit_question'

const editQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    attachments: z.array(z.string().uuid()),

})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
    constructor(
        private jwt: JwtService,
        private editQuestion: EditQuestionUseCase,
    ) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(new ZodValidationPipe(editQuestionBodySchema))
        body: EditQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string
    ) {
        const { title, content, attachments } = body

        const userId = user.sub

        const result = await this.editQuestion.execute({
            title: title,
            content: content,
            authorId: userId,
            attachmentIds: attachments,
            questionId
        })

        if (result.isLeft()) {
            throw new BadRequestException(result.value)
        }
    }

}
