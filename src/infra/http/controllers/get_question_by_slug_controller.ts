import { BadRequestException, Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt_auth.guard'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { QuestionPresenter } from '../presenters/question_presenter'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use_cases/get_question_by_slug'
import { QuestionDetailsPresenter } from '../presenters/question_details_presenter'



@Controller('/questions/:slug')
export class GetQuestionBySlugController {
    constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) { }

    @Get()
    async handle(@Param('slug') slug: string) {
        const result = await this.getQuestionBySlug.execute({
            slug
        })

        if (result.isLeft()) {
            throw new BadRequestException(result.value)
        }
        return { question: QuestionDetailsPresenter.toHTTP(result.value.question) }
    }
}
