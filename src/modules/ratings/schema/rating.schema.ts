import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RatingOptions } from 'src/enums/ratings.enums';

export type RatingDocument = HydratedDocument<Rating>;

@Schema({ timestamps: true })
export class Rating {
  @Prop()
  _id: string;

  @Prop()
  patientId: string;

  @Prop()
  doctorId: string;

  @Prop()
  sessionId: string;

  @Prop({ type: Number, enum: RatingOptions })
  sessionRating: RatingOptions;

  @Prop({ type: Number, enum: RatingOptions })
  doctorRating: RatingOptions;

  @Prop()
  sessionComment: string;

  @Prop()
  doctorComment: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
