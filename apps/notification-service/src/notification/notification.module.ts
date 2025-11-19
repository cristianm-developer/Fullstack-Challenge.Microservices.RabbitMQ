import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { initJwtModule } from '../jwt-module.config';
import { NotificationController } from './notification.controller';

@Module({
    imports: [
        initJwtModule()
    ],
    providers: [
        NotificationGateway, 
        NotificationService
    ],
    exports: [NotificationService, NotificationGateway],
    controllers: [NotificationController],
})
export class NotificationModule {

}
