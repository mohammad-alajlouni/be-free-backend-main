import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
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
  images: string[];

  @Prop()
  videos: string[];

  @Prop()
  price: number;

  @Prop()
  reviews: string[];

  @Prop()
  numberOfPatients: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
