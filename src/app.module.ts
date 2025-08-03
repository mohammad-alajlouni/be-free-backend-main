import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TwilioModule } from './modules/twilio/twilio.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { SessionModule } from './modules/session/session.module';
import { PatientsModule } from './modules/patients/patients.module';
import { NotesModule } from './modules/notes/notes.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { CoursesModule } from './modules/courses/courses.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { ChatModule } from './modules/chat/chat.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SecurityHelper } from './utils/security.helper';
import { MongoSanitizeMiddleware } from './middlewares/mongoSanitize.middleware';
import { XssSanitizeMiddleware } from './middlewares/xssSanitize.middleware';
import { SupabaseModule } from './modules/supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot(SecurityHelper.configureRateLimiter()),
    MongooseModule.forRoot(
      process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/be-free',
    ),
    AuthModule,
    UsersModule,
    TwilioModule,
    NotificationsModule,
    QuestionsModule,
    ScheduleModule,
    SessionModule,
    PatientsModule,
    NotesModule,
    StatisticsModule,
    CoursesModule,
    RatingsModule,
    MeetingsModule,
    ChatModule,
    ConsultationsModule,
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, SecurityHelper.configureThrottlerGuard()],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MongoSanitizeMiddleware)
      .forRoutes('*')
      .apply(XssSanitizeMiddleware)
      .forRoutes('*');
  }
}