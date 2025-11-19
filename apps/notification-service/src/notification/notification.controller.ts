import { Controller, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NOTIFICATION_PATTERNS, NotificationMessageDto } from '@repo/types';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationController {

    private readonly logger = new Logger(NotificationController.name);

    constructor(
        private readonly notificationService: NotificationService
    ) {}

    @MessagePattern(NOTIFICATION_PATTERNS.HANDLE_NOTIFICATION)
    async handleNotification(@Payload() payload: NotificationMessageDto){
        this.logger.log(`Receiving notification: ${JSON.stringify(payload)}`);
        this.notificationService.handleNotification(payload);
    }

}
