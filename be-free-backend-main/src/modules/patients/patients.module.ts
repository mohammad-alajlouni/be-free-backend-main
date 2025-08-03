import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schema/patient.schema';
import { NotesModule } from '../notes/notes.module';
import { JwtModule } from '@nestjs/jwt';
import { SecurityHelper } from 'src/utils/security.helper';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    NotesModule,
    JwtModule.register(SecurityHelper.configureJWTOptions()),
    SupabaseModule,
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [
    PatientsService,
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
})
export class PatientsModule {}
