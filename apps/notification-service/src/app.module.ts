import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MicroserviceLoggingModule } from '@repo/microservice-logging-module';
import { initMicroserviceHealth } from './microservice-health.config';
import { NotificationGateway } from './notification/notification.gateway';
import { NotificationModule } from './notification/notification.module';

const SERVICE_NAME = 'task-service';
const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isProduction ? undefined : '.env.example',
    }),
    MicroserviceLoggingModule.forRoot(SERVICE_NAME),
    initMicroserviceHealth(),
    NotificationModule
  ],
  controllers: [],
  providers: [],
  exports: [

  ]
})
export class AppModule {}
