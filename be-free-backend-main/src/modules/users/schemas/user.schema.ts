import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from 'src/enums/users.enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  _id: string;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  mobile: string;

  @Prop()
  birthdate: Date;

  @Prop()
  languages: string[];

  @Prop()
  profilePicture: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  degree: string;

  @Prop()
  university: string;

  @Prop()
  graduationYear: string;

  @Prop()
  specialization: string;

  @Prop()
  yearsOfExperience: string;

  @Prop()
  classification: string;

  @Prop()
  classificationExpiry: Date;

  @Prop()
  consultationType: string;

  @Prop()
  cv: string;

  @Prop()
  classificationFile: string;

  @Prop()
  lastDegree: string;

  @Prop()
  nationalId: string;

  @Prop()
  isActivated: boolean;

  @Prop()
  gender: number;

  @Prop()
  otp: string;

  @Prop()
  sessionTypes: string[];

  @Prop()
  specialities: string[];

  @Prop()
  bio: string;

  @Prop()
  sessionPrice: number;

  @Prop({ type: Number, enum: UserRole })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
