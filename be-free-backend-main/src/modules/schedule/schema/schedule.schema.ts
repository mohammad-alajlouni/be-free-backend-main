import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { WeekDays } from 'src/enums/days.enums';

export type TimeRangeDocument = HydratedDocument<TimeRange>;
export type DayScheduleDocument = HydratedDocument<DaySchedule>;
export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema()
export class TimeRange {
  @Prop()
  _id: string;

  @Prop({ required: false })
  from?: Date;

  @Prop({ required: false })
  to?: Date;

  @Prop({ required: true, default: true })
  isAvailable: boolean;
}

export const TimeRangeSchema = SchemaFactory.createForClass(TimeRange);

@Schema()
export class DaySchedule {
  @Prop()
  _id: string;

  @Prop({ required: true, enum: WeekDays })
  day: WeekDays;

  @Prop({ type: [TimeRangeSchema], required: false, default: [] })
  timeRanges: TimeRange[];
}

export const DayScheduleSchema = SchemaFactory.createForClass(DaySchedule);

@Schema({ timestamps: true })
export class Schedule {
  @Prop()
  _id: string;

  @Prop({ type: String, ref: 'User', required: true })
  doctorId: string;

  @Prop({ type: [DayScheduleSchema], required: true, default: [] })
  days: DaySchedule[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
