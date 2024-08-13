import {
  UsePipes,
  Body,
  Controller,
  Post,
  ConflictException,
  BadRequestException
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod_validation'
import { RegisterStudentUseCase } from '@/domain/forum/application/use_cases/register_student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use_cases/errors/student_already_exists_error'
import { Public } from '@/infra/auth/public'

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBody = z.infer<typeof createUserSchema>

@Controller('/accounts')
@UsePipes(new ZodValidationPipe(createUserSchema))
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) { }

  @Post()
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name, email, password
    })

    if (result.isLeft()) {
      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case StudentAlreadyExistsError:
            throw new ConflictException(error.message)
          default:
            throw new BadRequestException(error.message)
        }
      }
    }
  }
}
