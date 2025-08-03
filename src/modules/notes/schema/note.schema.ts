import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
  @Prop()
  _id: string;

  @Prop()
  patientId: string;

  @Prop()
  psychologistId: string;

  @Prop()
  content: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
