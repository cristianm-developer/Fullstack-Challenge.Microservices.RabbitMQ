import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationMessageDto } from '@repo/types';
import { NotificationGateway } from './notification.gateway';


const mockJwtService = {
  verify: jest.fn().mockReturnValue({ userId: 'test-user-id' }),
  decode: jest.fn().mockReturnValue({ userId: 'test-user-id' }),
};

const mockGateway = {
  sendNotification: jest.fn(),
};

describe('NotificationService', () => {
  let service: NotificationService;
  let gateway: NotificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService, 
        { provide: JwtService, useValue: mockJwtService }, 
        { provide: NotificationGateway, useValue: mockGateway }
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    gateway = module.get<NotificationGateway>(NotificationGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleNotification', () => {
    it('should be defined', () => {
      expect(service.handleNotification).toBeDefined();
    })

    it('should send the notification to the gateway', () => {
      const notification: NotificationMessageDto = {
        message: 'voce tem um novo comentario na tarefa que voce esta participando',
        data: { url: 'test' },
        title: 'Novo comentario',
        type: 'INFO',
        userId: '1',
      };
      service.handleNotification(notification);
      expect(gateway.sendNotification).toHaveBeenCalled();
    })
  })

});
