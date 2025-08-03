export interface TimeRange {
  from: Date;
  to: Date;
  isAvailable: boolean;
  readonly _id: string;
}

export interface DaySchedule {
  day: string;
  timeRanges: TimeRange[];
  readonly _id: string;
}

export interface ScheduleInterface {
  readonly _id: string;
  readonly doctorId: string;
  days: DaySchedule[];
}
