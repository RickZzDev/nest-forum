import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current_user.decorator'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use_cases/delete_question_comment'

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
    constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionCommentId: string,
    ) {
        const userId = user.sub

        const result = await this.deleteQuestionComment.execute({
            questionId: questionCommentId,
            authorId: userId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}