import { OnAnswerCreated } from "@/domain/notification/application/subscribers/on_answer_created";
import { OnQuestionBestAnswerChosen } from "@/domain/notification/application/subscribers/on_best_answer_choosen";
import { SendNotificationUseCase } from "@/domain/notification/application/usecases/send_notification";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [
        OnAnswerCreated,
        OnQuestionBestAnswerChosen,
        SendNotificationUseCase,
    ],
})
export class EventsModule { }