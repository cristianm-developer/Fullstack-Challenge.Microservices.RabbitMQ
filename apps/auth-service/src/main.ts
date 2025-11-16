import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initRabbitMQ } from './rabbitmq.config';

async function bootstrap() {

  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const HTTP_PORT = configService.get<number>('PORT') || 3000;

  await initRabbitMQ(app, configService);
  await app.startAllMicroservices();
  await app.listen(HTTP_PORT);

  logger.log(`Auth Service is running on port ${HTTP_PORT}`);
  logger.log(`RabbitMQ is running on ${configService.get<string>('RABBITMQ_URL')}`);
}
bootstrap();
