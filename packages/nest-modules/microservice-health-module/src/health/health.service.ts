import { Inject, Optional } from "@nestjs/common";
import { DiskHealthIndicator, HealthCheckService, MemoryHealthIndicator, MicroserviceHealthIndicator, TypeOrmHealthIndicator } from "@nestjs/terminus";
import { Transport } from "@nestjs/microservices";
import { RMQ_HEALTH_OPTIONS } from "../injection-token.js";
import os from 'os';

export class HealthService {

    constructor(
        private health: HealthCheckService,
        private microservice: MicroserviceHealthIndicator,
        @Optional() private db: TypeOrmHealthIndicator,
        private memory: MemoryHealthIndicator,
        private disk: DiskHealthIndicator,
        @Inject(RMQ_HEALTH_OPTIONS) private rmqUrls: string[],
        @Inject('INCLUDE_DB') private includeDb: boolean
    ){}

    async checkAllDependencies() {
        const rmqChecks = this.rmqUrls.map((url, index) => 
        () => this.microservice.pingCheck(`rabbitmq`, {
            transport: Transport.RMQ,
            options: {
                urls: [url],
                queue: `health_queue`
            }
        }));

        const rootPath = os.platform() === 'win32' ? 'C:\\' : '/';
        const mandatoryChecks = [
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.disk.checkStorage('disk_storage', {
                thresholdPercent: 0.9,
                path: rootPath                
            }),
            ...rmqChecks
        ];

        const allChecks = this.includeDb ? [...mandatoryChecks, () => this.db.pingCheck('database')] : mandatoryChecks;

        return this.health.check(allChecks);
    }

    
}