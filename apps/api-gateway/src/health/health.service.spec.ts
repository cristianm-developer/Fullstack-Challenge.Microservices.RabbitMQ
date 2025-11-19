import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { ClientProxy } from '@nestjs/microservices';
import { ServiceHealthDto, ServiceHealthStatus } from '@repo/types';
import { of } from 'rxjs';

describe('HealthService', () => {
  let service: HealthService;
  let notificationsClient: ClientProxy;
  let authClient: ClientProxy;
  let taskClient: ClientProxy;

  const mockClientProxy = {
    send: jest.fn(),
    emit: jest.fn(),
    toPromise: jest.fn(),
  };


  const mockNotificationsClient = {
    ...mockClientProxy,
  }

  const mockAuthClient = {
    ...mockClientProxy,
  };

  const mockTaskClient = {
    ...mockClientProxy,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: 'NOTIFICATIONS_CLIENT', useValue: mockNotificationsClient },
        { provide: 'AUTH_CLIENT', useValue: mockAuthClient },
        { provide: 'TASK_CLIENT', useValue: mockTaskClient },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    notificationsClient = module.get<ClientProxy>('NOTIFICATIONS_CLIENT');
    authClient = module.get<ClientProxy>('AUTH_CLIENT');
    taskClient = module.get<ClientProxy>('TASK_CLIENT');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkAllDependencies', () => {
    it('should be defined', () => {
      expect(service.checkAllDependencies).toBeDefined();
    });

    it('should return the health check result', async () => {
      [mockNotificationsClient, mockAuthClient, mockTaskClient].forEach(client => {
        client.send.mockReturnValue( of(
          {
            status: 'ok',
            details: {
              database: {
                status: 'up',
              },
              rabbitmq: {
                status: 'up',
              },
            }
          },
        ));
      });

      const result: ServiceHealthDto[] = await service.checkAllDependencies();
      expect(notificationsClient.send).toHaveBeenCalled();
      expect(authClient.send).toHaveBeenCalled();
      expect(taskClient.send).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result[0]?.status).toBe(ServiceHealthStatus.Ok);
      expect(result[1]?.status).toBe(ServiceHealthStatus.Ok);
      expect(result[2]?.status).toBe(ServiceHealthStatus.Ok);
    });
  });
});
