import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop()
  _id: string;

  @Prop()
  userId: string;

  @Prop()
  body: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
