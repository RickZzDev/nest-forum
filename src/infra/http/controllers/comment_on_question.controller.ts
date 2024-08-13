import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CurrentUser } from '@/infra/auth/current_user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use_cases/comment_on_question'

const commentOnQuestionBodySchema = z.object({
    content: z.string(),
})

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
    constructor(
        private jwt: JwtService,
        private commentOnQuestion: CommentOnQuestionUseCase,
    ) { }

    @Post()
    async handle(
        @Body(new ZodValidationPipe(commentOnQuestionBodySchema)) body: CommentOnQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('questionId') questionId: string
    ) {
        const { content } = body

        const userId = user.sub

        const result = await this.commentOnQuestion.execute({
            content: content,
            questionId: questionId,
            authorId: userId,
        })

        if (result.isLeft()) {
            throw new BadRequestException(result.value)
        }
    }

}
