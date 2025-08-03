import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session {
  @Prop()
  _id: string;

  @Prop({ type: String, ref: 'User', required: true, index: true })
  doctorId: string;

  @Prop({ type: String, ref: 'Patient', required: true, index: true })
  patientId: string;

  @Prop({ type: String, ref: 'Schedule', required: true, index: true })
  scheduleId: string;

  @Prop({ type: String, ref: 'Schedule', required: true, index: true })
  dayId: string;

  @Prop({ type: String, ref: 'Schedule', required: true, index: true })
  timeRangeId: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  numberOfSessions: number;

  @Prop({ required: true })
  duration: number;

  @Prop({ enum: ['Completed', 'Canceled', 'Current'], default: 'Current' })
  status?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
