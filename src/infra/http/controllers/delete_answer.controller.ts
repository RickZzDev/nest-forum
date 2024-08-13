import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CurrentUser } from '@/infra/auth/current_user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use_cases/delete_answer'


@Controller('/answers/:id')
export class DeleteAnswerController {
    constructor(
        private jwt: JwtService,
        private deleteAnswer: DeleteAnswerUseCase,
    ) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string
    ) {
        const userId = user.sub

        const result = await this.deleteAnswer.execute({
            id: answerId,
            authorId: userId,

        })

        if (result.isLeft()) {
            throw new BadRequestException(result.value)
        }
    }

}
