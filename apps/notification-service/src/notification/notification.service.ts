import { Injectable } from '@nestjs/common';
import { NotificationMessageDto } from '@repo/types';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationGateway: NotificationGateway,
    ) {}

    handleNotification(notification: NotificationMessageDto) {
        this.notificationGateway.sendNotification(notification);
    }

    
}
