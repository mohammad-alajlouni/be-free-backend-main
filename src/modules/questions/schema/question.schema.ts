import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { QuestionStatus } from 'src/enums/questions.enums';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
  @Prop()
  _id: string;

  @Prop()
  userId: string;

  @Prop()
  question: string;

  @Prop()
  answer: string;

  @Prop({ type: Number, enum: QuestionStatus })
  status: QuestionStatus;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
