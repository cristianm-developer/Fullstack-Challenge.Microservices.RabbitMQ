import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WebSocketProxyMiddleware } from './websocket-proxy.middleware';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const HTTP_PORT = configService.get<number>('PORT') || 3000;
  const wsHost = configService.get<string>('WS_HOST');

  // Establecer prefijo global /api para todos los controladores
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gateway - Jungle Gaming Challenge')
    .setDescription('Documentação da API Gateway com endpoints de autenticação e gerenciamento de tarefas')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Digite o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Autenticação', 'Endpoints relacionados à autenticação de usuários')
    .addTag('Tarefas', 'Endpoints relacionados ao gerenciamento de tarefas')
    .addTag('Saúde', 'Endpoints relacionados à verificação de saúde do sistema e serviços')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const server = await app.listen(process.env.PORT ?? 3000);

  // Setup WebSocket proxy upgrade handling
  if (wsHost) {
    logger.log(`WebSocket proxy configured to forward to: ${wsHost}`);
    logger.log(`WebSocket requests to /socket.io/* and /notifications will be proxied`);
    
    // Get the proxy middleware instance to attach WebSocket upgrade handler
    try {
      const wsProxyMiddleware = app.get(WebSocketProxyMiddleware);
      if (wsProxyMiddleware && wsProxyMiddleware.proxyMiddleware) {
        server.on('upgrade', wsProxyMiddleware.proxyMiddleware.upgrade);
        logger.log('WebSocket upgrade handler attached to server');
      }
    } catch (error) {
      logger.warn('Could not attach WebSocket upgrade handler. Middleware may handle it directly.');
    }
  } else {
    logger.warn('WS_HOST not configured. WebSocket proxy is disabled.');
  }

  logger.log(`API Gateway is running on port ${HTTP_PORT}`);
  logger.log(`Swagger documentation available at http://localhost:${HTTP_PORT}/api/docs`);
}
bootstrap();
