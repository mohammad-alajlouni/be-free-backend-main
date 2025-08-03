import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthWsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHandshake(socket);
    try {
      const payload = await this.jwtService.verifyAsync(token);
      socket.handshake.query.id = payload.id;
    } catch (err) {
      throw new WsException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHandshake(socket: Socket) {
    return socket.handshake.headers.authorization?.split(' ')[1] ?? '';
  }
}
