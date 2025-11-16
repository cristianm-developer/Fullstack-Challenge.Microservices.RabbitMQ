import { Controller } from "@nestjs/common";
import { HealthService } from "./health.service.js";
import { MessagePattern } from "@nestjs/microservices";
import { HEALTH_PATTERNS } from "@repo/types";



@Controller()
export class RmqHealthController {
    constructor(private healthService: HealthService) {}

    @MessagePattern(HEALTH_PATTERNS.HEALTH_CHECK)
    async checkHealth() {
        return await this.healthService.checkAllDependencies();
    }
    
}