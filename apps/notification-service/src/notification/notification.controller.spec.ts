import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationMessageDto } from '@repo/types';

const mockNotificationService = {
  handleNotification: jest.fn(),
};

describe('NotificationController', () => {
  let controller: NotificationController;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleNotification', () => {

    it('should be defined', () => {
      expect(controller.handleNotification).toBeDefined();
    })

    it('should handle the notification', async () => {
      const notification: NotificationMessageDto = {
        message: 'voce tem um novo comentario na tarefa que voce esta participando',
        data: { url: 'test' },
        title: 'Novo comentario',
        type: 'INFO',
        userId: '1',
      };
      await controller.handleNotification(notification);
      expect(notificationService.handleNotification).toHaveBeenCalled();
    })
  })
});
