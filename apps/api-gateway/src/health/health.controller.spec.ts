import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { ServiceHealthStatus } from '@repo/types';
import { AuthGuard } from '../auth/auth.guard';

const mockHealthService = {
  checkAllDependencies: jest.fn(),
};

const mockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        }
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkAllDependencies', () => {
    it('should be defined', () => {
      expect(controller.checkAllDependencies).toBeDefined();
    });

    it('should return the health check result', async () => {

      mockHealthService.checkAllDependencies.mockResolvedValue([
        {
          name: 'api-test',
          status: ServiceHealthStatus.Ok,
          database: ServiceHealthStatus.Undefined,
          rabbitMqClient: ServiceHealthStatus.Ok,
        }
      ])

      const result = await controller.checkAllDependencies();
      expect(result).toBeDefined();
      expect(result[0]?.status).toBe(ServiceHealthStatus.Ok);
    });
  });
});
