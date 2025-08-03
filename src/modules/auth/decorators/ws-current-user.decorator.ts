import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const AuthWsId = createParamDecorator(
  async (data: never, context: ExecutionContext) => {
    const socket = context.switchToWs().getClient<Socket>();
    console.log(socket.handshake.query.id);
    return socket.handshake.query.id as string;
  },
);
