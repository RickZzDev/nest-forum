import {
    BadRequestException,
    Controller,
    HttpCode,
    Param,
    Patch,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ReadNotificationUseCase } from '@/domain/notification/application/usecases/read_notification'
import { CurrentUser } from '@/infra/auth/current_user.decorator'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
    constructor(private readNotification: ReadNotificationUseCase) { }

    @Patch()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('notificationId') notificationId: string,
    ) {
        const result = await this.readNotification.execute({
            notificationId,
            receiverId: user.sub,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}