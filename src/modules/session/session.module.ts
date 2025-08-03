import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SessionRepository } from './repository/session.repository';
import { ChatRepository } from '../chat/repository/chat.repository';
import { ScheduleRepository } from '../schedule/repository/schedule.repository';

import { SessionService } from './session.service';
import { SessionController } from './session.controller';

import { SessionSchema } from './schema/session.schema';
import { ScheduleModule } from '../schedule/schedule.module';
import { ChatModule } from '../chat/chat.module';
import { ChatService } from '../chat/chat.service';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
    ScheduleModule,
    ChatModule,
    PatientsModule,
  ],
  controllers: [SessionController],
  providers: [
    SessionService,
    SessionRepository,
    ScheduleRepository,
    ChatRepository,
    ChatService,
  ],
  exports: [
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
    SessionService,
  ],
})
export class SessionModule {}
