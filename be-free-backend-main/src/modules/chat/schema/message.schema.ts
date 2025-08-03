import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop()
  _id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, ref: 'User', required: true })
  ownerId: string;

  @Prop({ type: String, ref: 'Chat', required: true })
  roomId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
