import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HEALTH_PATTERNS, ServiceHealthDto, ServiceHealthStatus } from '@repo/types';
import { HealthCheckResult } from '@nestjs/terminus';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthService {

    constructor(
        @Inject('NOTIFICATIONS_CLIENT')
        private readonly notificationsClient: ClientProxy,
        @Inject('AUTH_CLIENT')
        private readonly authClient: ClientProxy,
        @Inject('TASK_CLIENT')
        private readonly taskClient: ClientProxy,
    ){
        
    }   

    async checkAllDependencies() {
        const result = [
            {
                name: 'api-gateway',
                status: ServiceHealthStatus.Ok,
                database: ServiceHealthStatus.Undefined,
                rabbitMqClient: ServiceHealthStatus.Undefined,
            }
        ];

        const serviceChecks = [
            {
                name: 'notifications',
                promise: firstValueFrom(this.notificationsClient.send(HEALTH_PATTERNS.HEALTH_CHECK, {})),
            },
            {
                name: 'auth',
                promise: firstValueFrom(this.authClient.send(HEALTH_PATTERNS.HEALTH_CHECK, {})),
            },
            {
                name: 'task',
                promise: firstValueFrom(this.taskClient.send(HEALTH_PATTERNS.HEALTH_CHECK, {})),
            },
        ]

        const promises = serviceChecks.map((check) => check.promise);
        const results = await Promise.all(promises);

        const dependencyResults: ServiceHealthDto[] = results.map((r, i) => {

            const serviceName = serviceChecks[i]!.name;
            const result = r as HealthCheckResult;

            const details = result.details || result.info;
            const getStatus = (checkName: string) => {
                const terminusStatus = details?.[checkName]?.status;
                switch (terminusStatus) {
                    case 'up':
                        return ServiceHealthStatus.Ok;
                    case 'down':
                        return ServiceHealthStatus.Error;
                    default:
                        return ServiceHealthStatus.Undefined;
                }
            };

            const databaseStatus = getStatus('database');
            const rabbitMqClientStatus = getStatus('rabbitmq');

            const overallStatus = result.status === `ok` ? ServiceHealthStatus.Ok : ServiceHealthStatus.Error;

            return {
                name: serviceName,
                status: overallStatus,
                database: databaseStatus,
                rabbitMqClient: rabbitMqClientStatus,
            }
            
        })

        return dependencyResults;                
    }
}
