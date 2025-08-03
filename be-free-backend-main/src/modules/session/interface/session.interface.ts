export interface SessionInterface {
  readonly _id: string;
  scheduleId: any;
  readonly doctorId: string;
  readonly patientId: string;
  readonly dayId: string;
  readonly timeRangeId: string;
  numberOfSessions: number;
  duration: number;
  sessionType: string;
  notes: string;
  isPending: boolean;
  isRejected: boolean;
  status: string;
}
