import { MessageInterface } from './message.interface';

export interface RoomInterface {
  _id: string;
  doctorId: string;
  patientId: string;
  name: string;
  messages?: MessageInterface[];
}
