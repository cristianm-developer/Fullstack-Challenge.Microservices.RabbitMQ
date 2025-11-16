import { DynamicModule, Module, Provider } from "@nestjs/common";
import { DiskHealthIndicator, MemoryHealthIndicator, MicroserviceHealthIndicator, TerminusModule, TypeOrmHealthIndicator } from "@nestjs/terminus";
import { HttpHealthController } from "./health/http-health.controller.js";
import { HealthService } from "./health/health.service.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RmqHealthController } from "./health/rmq-health.controller.js";


export const RMQ_HEALTH_OPTIONS = 'RMQ_HEALTH_OPTIONS';

@Module({})
export class MicroserviceHealthModule {
    static register(rmqUrls: string[], includeDb?: boolean): DynamicModule{

        const imports: any[] = [
            TerminusModule.forRoot()
        ];

        const providers: Provider[] = [
            HealthService,
            MicroserviceHealthIndicator,
            MemoryHealthIndicator,
            DiskHealthIndicator,
            {
                provide: RMQ_HEALTH_OPTIONS,
                useValue: rmqUrls
            }
        ];

        if(includeDb) {
            imports.push(TypeOrmModule.forFeature([]));
            providers.push(TypeOrmHealthIndicator);
        }

        return {
            module: MicroserviceHealthModule,
            imports,
            controllers: [
                HttpHealthController,
                RmqHealthController
            ],
            providers: providers,
            exports: [
                HealthService
            ]
        }
    }
}