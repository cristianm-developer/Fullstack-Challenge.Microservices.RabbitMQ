import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { initPostgresql } from './posgresql.config';
import { MicroserviceLoggingModule } from '@repo/microservice-logging-module';
import { initMicroserviceHealth } from './microservice-health.config';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';

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
    initPostgresql(),
    TasksModule,
    CommentsModule
  ],
  controllers: [],
  providers: [],
  exports: [

  ]
})
export class AppModule {}
