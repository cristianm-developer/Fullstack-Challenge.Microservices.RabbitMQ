import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

export const initRabbitMQ = async (app: INestApplication, configService: ConfigService) => {

    const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');
    const RABBITMQ_QUEUE = configService.get<string>('RABBITMQ_QUEUE');

    if(!RABBITMQ_URL || !RABBITMQ_QUEUE) {
        throw new Error('RABBITMQ_URL or RABBITMQ_QUEUE is not set');
    }

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [RABBITMQ_URL!],
            queue: RABBITMQ_QUEUE!,
            noAck: false,
            queueOptions: {
                durable: false
            }
        }
    })
    
}