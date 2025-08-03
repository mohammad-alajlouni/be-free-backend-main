import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TwilioModule } from '../twilio/twilio.module';
import { UserCountSchema } from './schemas/UserCount.schema';
import { SupabaseModule } from '../supabase/supabase.module';
import { PatientsModule } from '../patients/patients.module';
import { JwtModule } from '@nestjs/jwt';
import { SecurityHelper } from 'src/utils/security.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'UserCountSchema', schema: UserCountSchema },
    ]),
    JwtModule.register(SecurityHelper.configureJWTOptions()),
    PatientsModule,
    TwilioModule,
    SupabaseModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    UsersService,
    MongooseModule.forFeature([
      { name: 'UserCountSchema', schema: UserCountSchema },
    ]),
  ],
})
export class UsersModule {}
