import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt_auth.guard'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use_cases/fetch_recent_questions'
import { QuestionPresenter } from '../presenters/question_presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryOaramSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQeustions: FetchRecentQuestionsUseCase) { }

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryOaramSchema) {
    const result = await this.fetchRecentQeustions.execute({
      page
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value)
    }

    const questions = result.value.questions

    return {
      questions: questions.map(QuestionPresenter.toHTTP)
    }
  }
}
