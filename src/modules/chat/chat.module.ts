import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoomSchema } from './schema/chat.schema';
import { MessageSchema } from './schema/message.schema';

import { ChatController } from './chat .controller';
import { ChatService } from './chat.service';

import { ChatRepository } from './repository/chat.repository';
import { ChatGateway } from './chat-getway';
import { SessionModule } from '../session/session.module';
import { JwtModule } from '@nestjs/jwt';
import { SecurityHelper } from 'src/utils/security.helper';
import { JwtStrategy } from '../auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    forwardRef(() => SessionModule),
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    JwtModule.register(SecurityHelper.configureJWTOptions()),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatRepository,
    ChatGateway,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    ChatService,
  ],
})
export class ChatModule {}
