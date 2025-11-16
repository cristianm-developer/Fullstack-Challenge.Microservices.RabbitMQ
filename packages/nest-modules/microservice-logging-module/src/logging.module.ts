import { Global, Module } from "@nestjs/common";
import { PINO_SERVICE_NAME } from "./consts/service-name.js";
import { PinoLoggingInterceptor } from "./logging/pino-logging.interceptor.js";
import { LoggerModule } from "pino-nestjs";

@Global()
@Module({})
export class MicroserviceLogginModule {
    static forRoot(serviceName: string) {
        return {
            module: MicroserviceLogginModule,
            imports: [
                LoggerModule.forRoot({
                    pinoHttp: {
                        transport: 
                            process.env.NODE_ENV === 'production' 
                            ? { target: 'pino-pretty' }
                            : undefined,
                        level: process.env.NODE_ENV 
                            ? 'debug'
                            : 'info',
                        base: {
                            context: 'MICROSERVICE_RPC',
                            pid: process.pid,
                            service: serviceName,
                        },
                        autoLogging: false
                    }
                })
            ],
            providers: [
                {
                    provide: PINO_SERVICE_NAME,
                    useValue: serviceName
                },
                PinoLoggingInterceptor,
                {
                    provide: 'APP_INTERCEPTOR',
                    useClass: PinoLoggingInterceptor
                }
            ],
            exports: [
                PinoLoggingInterceptor,
                LoggerModule
            ]
        }
    }
}
