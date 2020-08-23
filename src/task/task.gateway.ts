import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Task } from '@orm/entities/task.entity';

import { Server, Socket } from 'socket.io';

const PROJECT_ROOM_PREFIX = 'ProjectRoom';

@WebSocketGateway({ namespace: '/v1/projects/tasks', cookie: false })
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
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

  updateTaskForAll(@MessageBody() task: Task): void {
    this.wss.to(`${PROJECT_ROOM_PREFIX}${task.projectId}`).emit('taskUpdated', task);
  }

  @SubscribeMessage('joinAllParticipantProjectRooms')
  handleJoinAllParticipantProjects(client: Socket, projectIds: number[]) {
    // TODO: check project access before joining the project room
    projectIds.forEach((projectId) => {
      client.join(`${PROJECT_ROOM_PREFIX}${projectId}`);
      client.emit('joinParticipantProjectRoom', projectId);
    });
  }

  @SubscribeMessage('leaveAllParticipantProjectRooms')
  handleLeaveRoom(client: Socket) {
    client.leaveAll();
    client.emit('leaveAllRooms');
  }
}
