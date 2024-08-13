import { UnauthorizedException, Body, Controller, Post, BadRequestException } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use_cases/auth_student'
import { WrongCredentialsError } from '@/domain/forum/application/use_cases/errors/wrong_credentials_error'
import { Public } from '@/infra/auth/public'

const authSchema = z.object({
  email: z.string(),
  password: z.string(),
})

type AuthSchema = z.infer<typeof authSchema>

@Controller('/sessions')
@Public()
export class AuthController {
  constructor(
    private authenticateStudent: AuthenticateStudentUseCase
  ) { }

  @Post()
  async handle(@Body() body: AuthSchema) {
    const { email, password } = body
    const result = await this.authenticateStudent.execute({
      email, password
    })


    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }


    return {
      access_token: result.value.accessToken,
    }
  }
}
