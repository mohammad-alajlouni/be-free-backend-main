import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop()
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, ref: 'Patient', required: true })
  patientId: string;

  @Prop({ type: String, ref: 'User', required: true })
  doctorId: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
