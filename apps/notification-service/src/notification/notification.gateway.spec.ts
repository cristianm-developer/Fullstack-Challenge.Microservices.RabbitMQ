import { Test, TestingModule } from '@nestjs/testing';
import { NotificationGateway } from './notification.gateway';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { NotificationMessageDto } from '@repo/types';
import { JwtService } from '@nestjs/jwt';

const mockNotificationService = {
  verifyToken: jest.fn().mockReturnValue({ sub: 1 }),
};

const mockJwtService = {
  verify: jest.fn().mockReturnValue({ sub: 1 }),
};

describe('NotificationGateway', () => {
  let gateway: NotificationGateway;
  let notificationService: NotificationService;
  let mockServer: Partial<Server>;

  beforeEach(async () => {

    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [ 
        NotificationGateway, 
        { provide: JwtService, useValue: mockJwtService },
        { provide: NotificationService, useValue: mockNotificationService } 
      ]
    }).compile();

    gateway = module.get<NotificationGateway>(NotificationGateway);
    notificationService = module.get<NotificationService>(NotificationService);
    (gateway as any).server = mockServer as Server;

  })

  describe('handleConnection', () => {

    it('should be defined', () => {
      expect(gateway.handleConnection).toBeDefined();
    });

    it('should verify the token, get the user id and add the socket to the map', async () => {
      const client = {
        handshake: {
          headers: {
            authorization: 'Bearer test-token',
          },
        },
      } as Socket;

      await gateway.handleConnection(client);
      expect(gateway.userSocketMap.get('1')).toBe(client.id);
    });
  });

  describe('handleDisconnect', () => {
    it('should be defined', () => {
      expect(gateway.handleDisconnect).toBeDefined();
    });

    it('should get the user id and remove the socket from the map', async () => {
      const client = { id: 'test-socket-id' } as Socket;
      gateway.userSocketMap.set('1', client.id);
      await gateway.handleDisconnect(client);
      expect(gateway.userSocketMap.get(client.id)).toBeUndefined();
    });
  });

  describe('sendNotification', () => {
    it('should be defined', () => {
      expect(gateway.sendNotification).toBeDefined();
    });

    it('should send the notification to the user', async () => {
      const client = { id: 'test-socket-id' } as Socket;
      const notification: NotificationMessageDto = {
        message: 'voce tem um novo comentario na tarefa que voce esta participando',
        data: { url: 'test' },
        title: 'Novo comentario',
        type: 'INFO',
        userId: '1',
      };
      gateway.userSocketMap.set('1', client.id);
      await gateway.sendNotification(notification);
      expect(mockServer.to).toHaveBeenCalled();
    });
  })

});
