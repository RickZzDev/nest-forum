import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make_answer'
import { QuestionFactory } from 'test/factories/make_question'
import { StudentFactory } from 'test/factories/make_student'

describe('Choose question best answer Question (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwtService: JwtService
    let studentFactory: StudentFactory
    let answerFactory: AnswerFactory
    let questionFactory: QuestionFactory
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AnswerFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwtService = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        await app.init()
    })

    test('PATCH /answers/:answerId/choose-as-best', async () => {
        const user = await studentFactory.makePrismaStudent()
        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
            content: "Question content"
        })
        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id
        })

        const token = jwtService.sign({ sub: user.id.toString() })

        const response = await request(app.getHttpServer())
            .patch(`/answers/${answer.id.toString()}/choose-as-best`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'New Answer',
            })


        expect(response.statusCode).toBe(204)

        const questionSaved = await prisma.question.findUnique({
            where: {

                id: question.id.toString()
            },
        })

        expect(questionSaved?.bestAnswerId).toBe(answer.id.toString())
    })
})
