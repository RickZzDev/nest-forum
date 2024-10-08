import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make_attachment'
import { QuestionFactory } from 'test/factories/make_question'
import { StudentFactory } from 'test/factories/make_student'

describe('Answer Question (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwtService: JwtService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let attachmentFactory: AttachmentFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AttachmentFactory],
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwtService = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        attachmentFactory = moduleRef.get(AttachmentFactory)

        await app.init()
    })

    test('POST /questions/:questionId/answers', async () => {
        const user = await studentFactory.makePrismaStudent()
        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
            content: "Question content"
        })

        const token = jwtService.sign({ sub: user.id.toString() })

        const attachment1 = await attachmentFactory.makePrismaAttachment()
        const attachment2 = await attachmentFactory.makePrismaAttachment()

        const response = await request(app.getHttpServer())
            .post(`/questions/${question.id.toString()}/answers`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'New Answer',
                attachments: [attachment1.id.toString(), attachment2.id.toString()],

            })

        expect(response.statusCode).toBe(201)

        const answerOnDatabase = await prisma.answer.findFirst({
            where: {

                content: 'New Answer',
            },
        })

        expect(answerOnDatabase).toBeTruthy()

        const attachmentsOnDatabase = await prisma.attachment.findMany({
            where: {
                answerId: answerOnDatabase?.id,
            },
        })

        expect(attachmentsOnDatabase).toHaveLength(2)
    })
})
