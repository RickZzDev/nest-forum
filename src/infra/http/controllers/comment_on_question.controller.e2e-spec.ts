import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make_question'
import { StudentFactory } from 'test/factories/make_student'

describe('Comment on Question (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwtService: JwtService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwtService = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        await app.init()
    })

    test('POST /questions/:questionId/comments', async () => {
        const user = await studentFactory.makePrismaStudent()
        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
            content: "Question content"
        })

        const token = jwtService.sign({ sub: user.id.toString() })

        const response = await request(app.getHttpServer())
            .post(`/questions/${question.id.toString()}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'New Comment',
            })

        expect(response.statusCode).toBe(201)

        const commentSaved = prisma.comments.findFirst({
            where: {

                content: 'New Comment',
            },
        })

        expect(commentSaved).toBeTruthy()
    })
})
