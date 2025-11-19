import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { initPostgresql } from './posgresql.config';
import { MicroserviceLoggingModule } from '@repo/microservice-logging-module';
import { initMicroserviceHealth } from './microservice-health.config';

const SERVICE_NAME = 'auth-service';
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
    AuthModule
  ],
  controllers: [],
  providers: [],
  exports: [

  ]
})
export class AppModule {}
