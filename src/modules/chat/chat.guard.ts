import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChatService } from './chat.service';
import { RoomInterface } from './interface/room.interface';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly roomService: ChatService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const roomId = request.query.roomId;

    if (!user?.id) {
      throw new ForbiddenException('User ID is required');
    }

    if (!roomId) {
      throw new ForbiddenException('Room ID is required');
    }

    const room: RoomInterface = await this.roomService.getRoomById(roomId);

    if (!room) {
      throw new ForbiddenException('Room not found');
    }
    console.log(room, user.id);
    const isAuthorized =
      (room as any).data.doctorId === user.id ||
      (room as any).data.patientId === user.id;

    if (!isAuthorized) {
      throw new ForbiddenException(
        'You are not authorized to view this chat history',
      );
    }

    return true;
  }
}
