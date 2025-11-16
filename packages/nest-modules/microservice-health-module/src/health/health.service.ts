import { Inject, Optional } from "@nestjs/common";
import { DiskHealthIndicator, HealthCheckService, MemoryHealthIndicator, MicroserviceHealthIndicator, TypeOrmHealthIndicator } from "@nestjs/terminus";
import { RMQ_HEALTH_OPTIONS } from "../health.module.js";
import { Transport } from "@nestjs/microservices";


export class HealthService {

    constructor(
        private health: HealthCheckService,
        private microservice: MicroserviceHealthIndicator,
        @Optional() private db: TypeOrmHealthIndicator,
        private memory: MemoryHealthIndicator,
        private disk: DiskHealthIndicator,
        @Inject(RMQ_HEALTH_OPTIONS) private rmqUrls: string[]
    ){}

    async checkAllDependencies() {
        const rmqChecks = this.rmqUrls.map((url, index) => 
        () => this.microservice.pingCheck(`rabbitmq-${index}`, {
            transport: Transport.RMQ,
            options: {
                urls: [url],
                queue: `health_queue_${index}`
            }
        }));

        const mandatoryChecks = [
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
            () => this.disk.checkStorage('disk_storage', {
                thresholdPercent: 0.9,
                path: '/'                
            }),
            ...rmqChecks
        ];

        const allChecks = this.db ? [...mandatoryChecks, () => this.db.pingCheck('database')] : mandatoryChecks;

        return this.health.check(allChecks);
    }

    
}