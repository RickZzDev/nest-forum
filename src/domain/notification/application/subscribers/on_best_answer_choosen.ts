import { EventHandler } from 'src/core/events/event_handler'
import { AnswerRepository } from 'src/domain/forum/application/repositories/answers_repository'
import { SendNotificationUseCase } from '../usecases/send_notification'
import { DomainEvents } from 'src/core/events/domain_events'
import { QuestionBestAnswerChosenEvent } from 'src/domain/forum/enterprise/events/question_best_answer_choosen'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswerRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        receiverId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que você enviou em "${question.title
          .substring(0, 20)
          .concat('...')}" foi escolhida pelo autor!"`,
      })
    }
  }
}
