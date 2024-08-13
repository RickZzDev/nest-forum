import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { FetchQuestionCommentUseCase } from '@/domain/forum/application/use_cases/fetch_question_comment'
import { CommentPresenter } from '../presenters/comment_presenter'
import { CommentWithAuthorPresenter } from '../presenters/comment_with_autor_presenter'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
    constructor(private fetchQuestionComments: FetchQuestionCommentUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('questionId') questionId: string,
    ) {
        const result = await this.fetchQuestionComments.execute({
            page,
            questionId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const comments = result.value.comments

        return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) }
    }
}