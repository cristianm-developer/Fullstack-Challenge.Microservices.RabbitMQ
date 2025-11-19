import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { initJwtModule } from '../jwt-module.config';

@Module({
  imports: [
    initJwtModule(),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_CLIENT',
        imports: [],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')!],
            queue: configService.get<string>('RABBITMQ_AUTH_QUEUE')!,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, JwtStrategy],
  exports: [AuthGuard, JwtStrategy],
})
export class AuthModule {}
