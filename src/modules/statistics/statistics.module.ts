import { Module } from '@nestjs/common';

import { StatisticsRepository } from './repository/statistics.repository';
import { SessionRepository } from '../session/repository/session.repository';

import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { SessionModule } from '../session/session.module';
import { UsersModule } from '../users/users.module';
import { ChatModule } from '../chat/chat.module';
import { ChatRepository } from '../chat/repository/chat.repository';

@Module({
  imports: [SessionModule, UsersModule, ChatModule],
  controllers: [StatisticsController],
  providers: [
    StatisticsService,
    StatisticsRepository,
    SessionRepository,
    ChatRepository,
  ],
})
export class StatisticsModule {}
