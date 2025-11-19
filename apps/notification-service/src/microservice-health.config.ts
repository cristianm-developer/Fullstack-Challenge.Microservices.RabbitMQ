import { DynamicModule, ModuleMetadata } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MicroserviceHealthModule } from "@repo/microservice-health-module";


export const getMicroserviceHealthConfig = (configService: ConfigService) => {
    const RMQ_URLS = configService.get<string>('RABBITMQ_URL');
    if(!RMQ_URLS) {
        throw new Error('RABBITMQ_URLS is not set');
    }
    return {
        rmqUrls: RMQ_URLS!.split(',').map(e => e.trim()),
        includeDb: false
    }
}

export const initMicroserviceHealth = () => {
    return MicroserviceHealthModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => getMicroserviceHealthConfig(configService),
    })
}
