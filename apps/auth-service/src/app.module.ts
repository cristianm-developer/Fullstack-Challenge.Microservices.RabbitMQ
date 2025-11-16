import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { initPostgresql } from './posgresql.config';
import { MicroserviceHealthModule } from '@repo/microservice-health-module';

const SERVICE_NAME = 'auth-service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.example',
    }),
    
    initPostgresql(),
    AuthModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
