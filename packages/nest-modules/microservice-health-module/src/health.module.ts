import { DynamicModule, InjectionToken, Module, ModuleMetadata, Provider } from "@nestjs/common";
import {
  DiskHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  TerminusModule,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import { HttpHealthController } from "./health/http-health.controller.js";
import { HealthService } from "./health/health.service.js";
import { RmqHealthController } from "./health/rmq-health.controller.js";
import { RMQ_HEALTH_OPTIONS } from "./injection-token.js";
import checkDiskSpace from "check-disk-space";

@Module({})
export class MicroserviceHealthModule {
  static registerAsync(options: {
    imports?: ModuleMetadata["imports"];
    inject?: InjectionToken[];
    useFactory: (...args: any[]) => {
      rmqUrls: string[];
      includeDb?: boolean;
    };
  }): DynamicModule {

    const configProvider: Provider = {
      provide: 'ASYNC_CONFIG_OPTIONS',
      useFactory: options.useFactory,
      inject: options.inject ?? [],
    }
    

    const providers: Provider[] = [
      configProvider,
      {
        provide: RMQ_HEALTH_OPTIONS,
        useFactory: (config: { rmqUrls: string[] }) => config.rmqUrls,
        inject: ['ASYNC_CONFIG_OPTIONS'],
      },
      {
        provide: 'INCLUDE_DB',
        useFactory: (config: { includeDb?: boolean}) => config.includeDb,
        inject: ['ASYNC_CONFIG_OPTIONS'],
      },

      HealthService,
      MicroserviceHealthIndicator,
      MemoryHealthIndicator,
      DiskHealthIndicator,
      {
        provide: 'CheckDiskSpaceLib',
        useValue: checkDiskSpace,
      },      
      TypeOrmHealthIndicator
  
    ];    

    const imports = [
      TerminusModule,
      ...(options.imports ?? [])
    ]
    

    return {
      module: MicroserviceHealthModule,
      imports,
      controllers: [HttpHealthController, RmqHealthController],
      providers,
      exports: [HealthService],
      
    };
  }

  
}