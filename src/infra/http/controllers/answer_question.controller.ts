import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CurrentUser } from '@/infra/auth/current_user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use_cases/answer_question'

const answerQuestionBodySchema = z.object({
    content: z.string(),
    attachments: z.array(z.string().uuid()),

})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
    constructor(
        private jwt: JwtService,
        private answerQuestion: AnswerQuestionUseCase,
    ) { }

    @Post()
    async handle(
        @Body(new ZodValidationPipe(answerQuestionBodySchema)) body: AnswerQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('questionId') questionId: string
    ) {
        const { content, attachments } = body

        const userId = user.sub

        const result = await this.answerQuestion.execute({
            content: content,
            questionId: questionId,
            authorId: userId,
            attachmentsIds: attachments
        })

        if (result.isLeft()) {
            throw new BadRequestException(result.value)
        }
    }

}
