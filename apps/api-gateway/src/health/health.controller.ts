import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Saúde')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('health-check')
export class HealthController {
    
    constructor(private healthService: HealthService) {}

    @Get()
    @ApiOperation({ 
        summary: 'Verificar saúde do sistema', 
        description: 'Verifica o status de saúde de todos os serviços dependentes (notificações, autenticação e tarefas), incluindo status do banco de dados e RabbitMQ de cada serviço' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Verificação de saúde realizada com sucesso. Retorna o status de cada serviço dependente' 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Não autorizado. Token JWT inválido ou ausente' 
    })
    @ApiResponse({ 
        status: 503, 
        description: 'Serviço indisponível. Um ou mais serviços dependentes estão fora do ar' 
    })
    async checkAllDependencies() {
        return await this.healthService.checkAllDependencies();        
    }
}
