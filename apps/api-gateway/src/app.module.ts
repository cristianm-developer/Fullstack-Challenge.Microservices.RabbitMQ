import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { LoggerModule } from 'pino-nestjs';
import { initJwtModule } from './jwt-module.config';
import { WebSocketProxyMiddleware } from './websocket-proxy.middleware';

const SERVICE_NAME = 'api-gateway';
const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isProduction ? undefined : '.env.example',
    }),
    ThrottlerModule.forRoot([{
      ttl: 1000, 
      limit: 10, 
    }]),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: process.env.NODE_ENV === 'production' 
          ? { 
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: false,
                translateTime: 'SYS:standard',
              }
            } 
          : undefined,
        base: {
          context: 'API_GATEWAY',
          pid: process.pid,
          service: SERVICE_NAME,
        }       
      }
    }),
    initJwtModule(),
    HealthModule,
    AuthModule,
    TaskModule,
  ],
  
  controllers: [],
  providers: [
    WebSocketProxyMiddleware,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WebSocketProxyMiddleware)
      .forRoutes('*');
  }
}
