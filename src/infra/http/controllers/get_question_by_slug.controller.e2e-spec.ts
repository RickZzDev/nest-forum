import { Slug } from '@/domain/forum/enterprise/entities/value_objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make_attachment'
import { QuestionFactory } from 'test/factories/make_question'
import { QuestionAttachmentFactory } from 'test/factories/make_question_atachement'
import { StudentFactory } from 'test/factories/make_student'

describe('Get question by slug (E2E)', () => {
    let app: INestApplication
    let jwtService: JwtService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let attachmentFactory: AttachmentFactory
    let questionAttachmentFactory: QuestionAttachmentFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AttachmentFactory,
                QuestionAttachmentFactory,
            ]
        }).compile()

        app = moduleRef.createNestApplication()
        jwtService = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        attachmentFactory = moduleRef.get(AttachmentFactory)
        questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

        await app.init()
    })

    test('GET/questions/:slug', async () => {
        const user = await studentFactory.makePrismaStudent({
            name: 'John Doe',
        })
        const token = jwtService.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
            title: 'Question 02',
            slug: Slug.create('question-02'),
        })

        const attachment = await attachmentFactory.makePrismaAttachment({
            title: 'Some attachment',
        })

        await questionAttachmentFactory.makePrismaQuestionAttachment({
            attachmentId: attachment.id,
            questionId: question.id,
        })

        const response = await request(app.getHttpServer())
            .get('/questions/question-02')
            .set('Authorization', `Bearer ${token}`)
            .send()
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            question: expect.objectContaining({
                title: 'Question 02',
                author: 'John Doe',
                attachments: [
                    expect.objectContaining({
                        title: 'Some attachment',
                    }),
                ],
            }),
        })
    })
})
