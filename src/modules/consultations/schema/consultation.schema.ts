import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConsultationDocument = HydratedDocument<Consultation>;

@Schema({ timestamps: true })
export class Consultation {
  @Prop()
  _id: string;

  @Prop({ type: String, ref: 'Patient', required: true, index: true })
  patientId: string;

  @Prop()
  numberOfSessions: number;

  @Prop()
  duration: number;

  @Prop()
  sessionType: string;

  @Prop()
  gender: number;

  @Prop({ required: false })
  notes?: string;

  @Prop({ type: String, ref: 'User', required: false })
  acceptedBy?: string;

  @Prop({ default: 'pending' }) // pending, accepted, rejected
  status: string;

  @Prop({ type: [String], default: [] }) // Array to store doctor IDs who rejected the consultation
  rejectedBy: string[];
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);
