import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserCountDocument = HydratedDocument<UserCount>;

@Schema({ timestamps: true })
export class UserCount {
  @Prop()
  _id: string;

  @Prop({ type: String, ref: 'User', required: true, index: true })
  doctorId: string;

  @Prop({ type: String, ref: 'User', required: true, index: true })
  patientId: string;
}

export const UserCountSchema = SchemaFactory.createForClass(UserCount);
