import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtPayload } from '../../../../packages/types/dist/types/libs/auth';
import { NotificationMessageDto } from '@repo/types';
import { JwtService } from '@nestjs/jwt';


@Injectable()
@WebSocketGateway({
  namespace: '/notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  userSocketMap = new Map<string, string>(); 
  socketUserMap = new Map<string, string>();

  handleConnection(client: Socket, ...args: any[]): void {
    const token = client.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      return;
    }
    let decoded: JwtPayload;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      this.logger.error(`Error verifying token: ${error}`);
      client.disconnect();
    }
    this.userSocketMap.set(decoded!.sub.toString(), client.id);
    this.socketUserMap.set(client.id, decoded!.sub.toString());
    this.logger.log(`User ${decoded!.sub} connected with socket ${client.id}`);
  }

  handleDisconnect(client: Socket): void {

    const userId = this.socketUserMap.get(client.id);
    if (!userId) {
      return;
    }
    this.userSocketMap.delete(userId);
    this.socketUserMap.delete(client.id);

    this.logger.log(`User ${userId} disconnected with socket ${client.id}`);
  }

  sendNotification(notification: NotificationMessageDto): void {
    const userId = this.userSocketMap.get(notification.userId!.toString());
    if (!userId) {
      return;
    }
    this.server.to(userId).emit('notification', notification);
    this.logger.log(`Notification sent to user ${notification.userId}`);
  }

}
