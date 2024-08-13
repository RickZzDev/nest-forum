import { BadRequestException, Body, Controller, Delete, HttpCode, Param, Post, Put } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CurrentUser } from '@/infra/auth/current_user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use_cases/delete_question'


@Controller('/questions/:id')
export class DeleteQuestionController {
    constructor(
        private jwt: JwtService,
        private deleteQuestion: DeleteQuestionUseCase,
    ) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string
    ) {
        const userId = user.sub
        const result = await this.deleteQuestion.execute({
            questionId: questionId,
            authorId: userId,

        })

        if (result.isLeft()) {
            throw new BadRequestException(result.value)
        }
    }

}
