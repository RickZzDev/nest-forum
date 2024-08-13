import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CurrentUser } from '@/infra/auth/current_user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { CreateQuestionUseCase } from '@/domain/forum/application/use_cases/create_question'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),

})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(
    private jwt: JwtService,
    private createQuestion: CreateQuestionUseCase,
  ) { }

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, title, attachments } = body

    const userId = user.sub

    const result = await this.createQuestion.execute({
      title: title, content: content, authorId: userId,
      attachmentsIds: attachments
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value)
    }
  }

}
