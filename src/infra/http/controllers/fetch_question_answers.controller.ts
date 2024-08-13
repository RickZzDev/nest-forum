import { BadRequestException, Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt_auth.guard'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { QuestionPresenter } from '../presenters/question_presenter'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use_cases/fetch_question_answers'
import { AnswerPresenter } from '../presenters/answer_presenter'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

type PageQueryOaramSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
    constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) { }

    @Get()
    async handle(@Query('page', queryValidationPipe) page: PageQueryOaramSchema,
        @Param('questionId') questionId: string,) {


        const result = await this.fetchQuestionAnswers.execute({
            page,
            questionId
        })

        if (result.isLeft()) {
            throw new BadRequestException(result.value)
        }

        const answers = result.value.answers

        return {
            answers: answers.map(AnswerPresenter.toHTTP)
        }
    }
}
