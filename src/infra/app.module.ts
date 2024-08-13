import { Module } from '@nestjs/common'
import { PrismaService } from './database/prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { CreateQuestionController } from './http/controllers/create_question.controller'
import { FetchRecentQuestionsController } from './http/controllers/fetch_recent_question.controller'
import { CreateAccountController } from './http/controllers/create_account.controller'
import { HttpModule } from './http/http.module'
import { EnvService } from './env/env.service'
import { EnvModule } from './env/env.module'
import { EventsModule } from './events/event.module'

@Module({
  imports: [
    AuthModule,
    HttpModule,
    EnvModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EventsModule
  ],
  providers: [
    EnvService
  ]
})
export class AppModule { }
