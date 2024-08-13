import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Question } from '@prisma/client'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make_answer'
import { QuestionFactory } from 'test/factories/make_question'
import { StudentFactory } from 'test/factories/make_student'

describe('Delete Answer (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwtService: JwtService
    let studentFactory: StudentFactory
    let answerFactory: AnswerFactory
    let questionFactory: QuestionFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, AnswerFactory, QuestionFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwtService = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        await app.init()
    })

    test('DELETE /answers/:id', async () => {
        const user = await studentFactory.makePrismaStudent()

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })
        const answer = await answerFactory.makePrismaAnswer({
            authorId: user.id,
            content: "Answer content",
            questionId: question.id
        })

        const token = jwtService.sign({ sub: user.id.toString() })

        const response = await request(app.getHttpServer())
            .delete(`/answers/${answer.id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'New Answer',
                content: 'Answer content updated',
            })

        expect(response.statusCode).toBe(204)

        const answerSaved = await prisma.answer.findUnique({
            where: {
                id: answer.id.toString()

            },
        })
        expect(answerSaved).toBeNull()
    })
})
