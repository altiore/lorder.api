import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/projects/tasks' })
export class ProjectTaskGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  wss: Server;

  private logger: Logger = new Logger('ProjectTaskGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client Disconnected: ' + client.id);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Client connected: ' + client.id);
  }

  @SubscribeMessage('taskUpdated')
  async taskUpdated(@MessageBody() data: string): Promise<void> {
    this.wss.emit('taskUpdated', data);
  }
}
