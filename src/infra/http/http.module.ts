import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create_account.controller";
import { CreateQuestionController } from "./controllers/create_question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch_recent_question.controller";
import { PrismaService } from "../database/prisma/prisma.service";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use_cases/create_question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use_cases/fetch_recent_questions";
import { RegisterStudentUseCase } from "@/domain/forum/application/use_cases/register_student";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use_cases/auth_student";
import { CryptographyModule } from "../criptography/cryptography.module";
import { AuthController } from "./controllers/auth.controller";
import { GetQuestionBySlugController } from "./controllers/get_question_by_slug_controller";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use_cases/get_question_by_slug";
import { EditQuestionController } from "./controllers/edit_question.controller";
import { EditQuestionUseCase } from "@/domain/forum/application/use_cases/edit_question";
import { DeleteQuestionController } from "./controllers/delete_question.controller";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use_cases/delete_question";
import { AnswerQuestionController } from "./controllers/answer_question.controller";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use_cases/answer_question";
import { EditAnswerController } from "./controllers/edit_answer.controller";
import { EditAnswerUseCase } from "@/domain/forum/application/use_cases/edit_answer";
import { DeleteAnswerController } from "./controllers/delete_answer.controller";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use_cases/delete_answer";
import { FetchQuestionAnswersController } from "./controllers/fetch_question_answers.controller";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use_cases/fetch_question_answers";
import { ChooseQuestionBestAnswerController } from "./controllers/choose_question_best_answer.controller";
import { ChooseBestQuestionAnswerUseCase } from "@/domain/forum/application/use_cases/choose_question_best_answer";
import { CommentOnQuestionController } from "./controllers/comment_on_question.controller";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use_cases/comment_on_question";
import { DeleteQuestionCommentController } from "./controllers/delete_question_comment.controller";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use_cases/delete_question_comment";
import { CommentOnAnswerController } from "./controllers/comment_on_answer.controller";
import { CommentOnAnswerstionCommentUseCase } from "@/domain/forum/application/use_cases/comment_on_answer";
import { DeleteAnswerCommentController } from "./controllers/delete_answer_comment.controller";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use_cases/delete_answer_comment";
import { FetchQuestionCommentsController } from "./controllers/fetch_question_comments.controller";
import { FetchQuestionCommentUseCase } from "@/domain/forum/application/use_cases/fetch_question_comment";
import { FetchAnswerCommentsController } from "./controllers/fetch_answer_comments.controller";
import { FetchAnswerCommentUseCase } from "@/domain/forum/application/use_cases/fetch_answer_comment";
import { UploadAttachmentController } from "./controllers/upload_atachment.controller";
import { StorageModule } from "../storage/storage.module";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use_cases/upload_and_create_attachment";
import { ReadNotificationUseCase } from "@/domain/notification/application/usecases/read_notification";
import { ReadNotificationController } from "./controllers/read_notification.controller";

@Module({
    imports: [DatabaseModule, CryptographyModule, StorageModule],
    providers: [
        CreateQuestionUseCase,
        FetchRecentQuestionsUseCase,
        RegisterStudentUseCase,
        AuthenticateStudentUseCase,
        GetQuestionBySlugUseCase,
        EditQuestionUseCase,
        DeleteQuestionUseCase,
        AnswerQuestionUseCase,
        EditAnswerUseCase,
        DeleteAnswerUseCase,
        FetchQuestionAnswersUseCase,
        ChooseBestQuestionAnswerUseCase,
        CommentOnQuestionUseCase,
        DeleteQuestionCommentUseCase,
        CommentOnAnswerstionCommentUseCase,
        DeleteAnswerCommentUseCase,
        FetchQuestionCommentUseCase,
        FetchAnswerCommentUseCase,
        UploadAndCreateAttachmentUseCase,
        ReadNotificationUseCase

    ],
    controllers: [
        AuthController,
        CreateAccountController,
        CreateQuestionController,
        FetchRecentQuestionsController,
        GetQuestionBySlugController,
        EditQuestionController,
        DeleteQuestionController,
        AnswerQuestionController,
        EditAnswerController,
        DeleteAnswerController,
        FetchQuestionAnswersController,
        ChooseQuestionBestAnswerController,
        CommentOnQuestionController,
        DeleteQuestionCommentController,
        CommentOnAnswerController,
        DeleteAnswerCommentController,
        FetchQuestionCommentsController,
        FetchAnswerCommentsController,
        UploadAttachmentController,
        ReadNotificationController
    ],
})
export class HttpModule { }