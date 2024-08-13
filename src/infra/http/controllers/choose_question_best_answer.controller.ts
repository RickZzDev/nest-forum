import { BadRequestException, Body, Controller, HttpCode, Param, Patch, Post, Put } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CurrentUser } from '@/infra/auth/current_user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ChooseBestQuestionAnswerUseCase } from '@/domain/forum/application/use_cases/choose_question_best_answer'


@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
    constructor(
        private jwt: JwtService,
        private chooseQuestionBestAnswer: ChooseBestQuestionAnswerUseCase,
    ) { }

    @Patch()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('answerId') answerId: string
    ) {

        const userId = user.sub

        const result = await this.chooseQuestionBestAnswer.execute({
            answerId,
            authorId: userId
        })

        if (result.isLeft()) {
            throw new BadRequestException(result.value)
        }
    }

}
