import { ChatService } from './chat.service';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionService } from '../session/session.service';
import { JwtService } from '@nestjs/jwt';
import { AuthWsId } from '../auth/decorators/ws-current-user.decorator';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthWsGuard } from '../auth/auth-ws.guard';

@UseGuards(AuthWsGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();
  private onlineUsers = new Set<string>();
  activeUsers = new Map<string, string>();

  constructor(
    private readonly chatService: ChatService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const token = this.extractTokenFromHandshake(socket);
      const payload = await this.jwtService.verifyAsync(token);
      console.log(`Client Connected: ${socket.id} with id: ${payload.id}`);
      this.activeUsers.set(payload.id, socket.id);
    } catch (e) {
      socket.disconnect(true);
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    try {
      const token = this.extractTokenFromHandshake(socket);
      const payload = await this.jwtService.verifyAsync(token);
      if (this.activeUsers.has(payload.id)) this.activeUsers.delete(payload.id);
    } catch (e) {}
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    body: { roomId: string; content: string; toId: string },
    @AuthWsId() authId: string,
  ) {
    const senderSocketId = this.activeUsers.get(authId);
    await this.chatService.createMessage(
      senderSocketId,
      body.roomId,
      body.content,
    );

    const receiverSocketId = this.activeUsers.get(body.toId);

    if (senderSocketId) {
      this.server.to(senderSocketId).emit('receiveMessage', {
        fromId: senderSocketId,
        toId: body.toId,
        content: body.content,
      });
    }

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receiveMessage', {
        fromId: senderSocketId,
        toId: body.toId,
        content: body.content,
      });
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    client: Socket,
    payload: {
      roomId: string;
      userId: string;
      isTyping: boolean;
      patientId: string;
      doctorId: string;
    },
  ) {
    const { roomId, userId, isTyping, patientId, doctorId } = payload;

    if (!(await this.isSessionBooked(patientId, doctorId))) {
      client.emit(
        'error',
        'You are not authorized to send typing indicators in this chat',
      );
      return;
    }

    this.server.to(roomId).emit('typing', { userId, isTyping });
  }

  @SubscribeMessage('message-read')
  async handleMessageRead(
    client: Socket,
    payload: {
      roomId: string;
      messageId: string;
      readerId: string;
      patientId: string;
      doctorId: string;
    },
  ) {
    const { roomId, messageId, readerId, patientId, doctorId } = payload;

    if (!(await this.isSessionBooked(patientId, doctorId))) {
      client.emit(
        'error',
        'You are not authorized to send read receipts in this chat',
      );
      return;
    }

    this.server.to(roomId).emit('message-read', { messageId, readerId });
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    client: Socket,
    payload: { patientId: string; doctorId: string },
  ) {
    const { patientId, doctorId } = payload;

    if (!(await this.isSessionBooked(patientId, doctorId))) {
      client.emit('error', 'Session is not booked');
      return;
    }

    const room = await this.chatService.createRoom(patientId, doctorId);

    client.join(room.data);
    this.users.set(client.id, `${patientId}:${doctorId}`);
    this.onlineUsers.add(patientId);
    this.onlineUsers.add(doctorId);

    client.emit('room', room.data);

    this.server.to(room.data).emit('user-online', {
      userId: patientId,
      status: 'online',
    });
    this.server.to(room.data).emit('user-online', {
      userId: doctorId,
      status: 'online',
    });
  }

  private async isSessionBooked(patientId: string, doctorId: string) {
    const isSessionValid = await this.sessionService.validateSession(
      patientId,
      doctorId,
    );
    return isSessionValid;
  }
  private extractTokenFromHandshake(socket: Socket) {
    return socket.handshake.headers.authorization?.split(' ')[1] ?? '';
  }
}
