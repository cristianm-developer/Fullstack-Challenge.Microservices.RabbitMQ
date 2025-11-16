import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health.service.js";
import { HealthCheck } from "@nestjs/terminus";

@Controller('health')
export class HttpHealthController {
    constructor(private healthService: HealthService) {}

    @Get()
    @HealthCheck()
    async checkHttp() {
        return await this.healthService.checkAllDependencies();
    }
    
    
}
