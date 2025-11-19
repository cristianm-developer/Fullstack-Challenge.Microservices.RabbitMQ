import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { TaskLog } from './entities/task-log.entity';
import { RelUserTask } from './entities/rel-user-task.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task, TaskLog, RelUserTask]),
        ClientsModule.registerAsync([
            {
                name: 'TASK_SERVICE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL')!],
                        queue: configService.get<string>('RABBITMQ_QUEUE')!,
                        queueOptions: {
                            durable: false,
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule {}
