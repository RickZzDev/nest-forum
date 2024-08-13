import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma_question_repository";
import { PrismaQuestionsCommentRepository } from "./prisma/repositories/prisma_question_comment_repository";
import { PrismaQuestionAttachmentCommentRepository } from "./prisma/repositories/prisma_question_attachments_repository";
import { PrismaAnswerCommentRepository } from "./prisma/repositories/prisma_answer_comments_repository";
import { PrismaAnswertAttachmentRepository } from "./prisma/repositories/prisma_answer_attachments_repository";
import { PrismaAnswertRepository } from "./prisma/repositories/prisma_answers_repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/question_repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/students_repository";
import { PrismaStudentRepository } from "./prisma/repositories/prisma_student_repository";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question_comment_repository";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question_attachments_repository";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer_comment_repository";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers_repository";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer_attachments_repository";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachment_repository";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notification_repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma_notification_repository";
import { CacheModule } from "../cache/cache.module";

@Module({
    imports: [CacheModule],
    providers: [
        PrismaService,
        {
            provide: QuestionsRepository, useClass: PrismaQuestionsRepository
        },
        {
            provide: StudentsRepository, useClass: PrismaStudentRepository
        },
        { provide: QuestionCommentRepository, useClass: PrismaQuestionsCommentRepository, },
        { provide: QuestionAttachmentRepository, useClass: PrismaQuestionAttachmentCommentRepository, },
        { provide: AnswerCommentRepository, useClass: PrismaAnswerCommentRepository, },
        { provide: AnswerRepository, useClass: PrismaAnswertRepository, },
        { provide: AnswerAttachmentRepository, useClass: PrismaAnswertAttachmentRepository },
        {
            provide: AttachmentsRepository,
            useClass: PrismaAttachmentsRepository,
        },
        {
            provide: NotificationsRepository,
            useClass: PrismaNotificationsRepository,
        },

    ],
    exports: [
        PrismaService,
        QuestionsRepository,
        StudentsRepository,
        QuestionCommentRepository,
        QuestionAttachmentRepository,
        AnswerCommentRepository,
        AnswerRepository,
        AnswerAttachmentRepository,
        AttachmentsRepository,
        NotificationsRepository
    ]
})
export class DatabaseModule { }