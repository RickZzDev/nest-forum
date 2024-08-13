import {
    BadRequestException,
    Body,
    Controller,
    Param,
    Post,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { CommentOnAnswerstionCommentUseCase } from '@/domain/forum/application/use_cases/comment_on_answer'
import { CurrentUser } from '@/infra/auth/current_user.decorator'

const commentOnAnswerBodySchema = z.object({
    content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
    constructor(private commentOnAnswer: CommentOnAnswerstionCommentUseCase) { }

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('answerId') answerId: string,
    ) {
        const { content } = body
        const userId = user.sub

        const result = await this.commentOnAnswer.execute({
            content,
            answerId,
            authorId: userId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}