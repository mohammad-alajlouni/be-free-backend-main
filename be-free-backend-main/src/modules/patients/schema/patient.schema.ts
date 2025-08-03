import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MaritalStatus } from 'src/enums/maritalStatus.enums';
import {
  AwarenessLevel,
  CurrentJobStatus,
  Gender,
  HowCanWeHelpYou,
  WhereDidYouHearAboutUs,
} from 'src/enums/patients.enums';
import { UserRole } from 'src/enums/users.enums';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ timestamps: true })
export class Patient {
  @Prop()
  _id: string;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  mobile: string;

  @Prop({ type: Number, enum: Gender })
  gender: Gender;

  @Prop({ type: Number, enum: MaritalStatus })
  maritalStatus: MaritalStatus;

  @Prop()
  birthdate: Date;

  @Prop()
  profilePicture: string;

  @Prop()
  isActivated: boolean;

  @Prop()
  otp: string;

  @Prop({ type: Number, enum: UserRole })
  role: UserRole;

  @Prop({ type: Number, enum: AwarenessLevel })
  awarenessLevel: AwarenessLevel;

  @Prop({ type: Number, enum: CurrentJobStatus })
  currentJobStatus: CurrentJobStatus;

  @Prop({ type: Number, enum: HowCanWeHelpYou })
  howCanWeHelpYou: HowCanWeHelpYou;

  @Prop({ type: Number, enum: WhereDidYouHearAboutUs })
  whereDidYouHearAboutUs: WhereDidYouHearAboutUs;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
