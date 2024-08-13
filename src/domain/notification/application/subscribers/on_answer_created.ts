import { QuestionsRepository } from 'src/domain/forum/application/repositories/question_repository'
import { DomainEvents } from '../../../../../src/core/events/domain_events'
import { EventHandler } from '../../../../../src/core/events/event_handler'
import { AnswerCreated } from '../../../../../src/domain/forum/enterprise/events/answer_created_event'
import { SendNotificationUseCase } from '../usecases/send_notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      // O bind diz que o this vai sempre ser a OnAnswerCreated
      this.sendNewAnswerNotification.bind(this),
      AnswerCreated.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreated) {
    // Não é problema acessar um repositório de um outro subdomínio especificamente na camada de subscribers
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      this.sendNotification.execute({
        receiverId: question.authorId.toString(),
        title: `Nova resposta em ${question.title.substring(0, 40).concat('...')}`,
        content: answer.excerpt,
      })
    }
  }
}
