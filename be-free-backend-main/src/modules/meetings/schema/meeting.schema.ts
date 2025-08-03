import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MeetingDocument = HydratedDocument<Meeting>;

@Schema({ timestamps: true })
export class Meeting {
  @Prop()
  _id: string;

  @Prop()
  doctorId: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  goals: string[];

  @Prop()
  thumbnail: string;

  @Prop()
  video: string;

  @Prop()
  isRecorded: boolean;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
