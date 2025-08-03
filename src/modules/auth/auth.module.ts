import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SecurityHelper } from '../../utils/security.helper';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersModule } from '../users/users.module';
import { TwilioModule } from '../twilio/twilio.module';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PatientsModule,
    TwilioModule,
    PassportModule,
    JwtModule.register(SecurityHelper.configureJWTOptions()),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
