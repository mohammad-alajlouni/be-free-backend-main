import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RoomInterface } from '../interface/room.interface';
import { MessageInterface } from '../interface/message.interface';
import mongoose from 'mongoose';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<RoomInterface>,
    @InjectModel('Message')
    private readonly messageModel: Model<MessageInterface>,
  ) {}

  async createRoom(
    patientId: string,
    doctorId: string,
  ): Promise<RoomInterface> {
    const body = {
      patientId,
      doctorId,
      name: `Room-${doctorId}-${patientId}`,
      _id: new mongoose.Types.ObjectId().toString(),
    };
    return await this.roomModel.create(body);
  }

  async getRoomById(roomId: string): Promise<RoomInterface> {
    return await this.roomModel.findById(roomId).lean();
  }

  async deleteRoom(patientId: string, doctorId: string): Promise<void> {
    await this.roomModel.findOneAndDelete({ patientId, doctorId });
  }

  async createMessage(
    ownerId: string,
    roomId: string,
    content: string,
  ): Promise<void> {
    const body = {
      _id: new mongoose.Types.ObjectId().toString(),
      ownerId,
      roomId,
      content,
    };
    await this.messageModel.create(body);
  }

  async getChatHistoryByRoomId(roomId: string): Promise<MessageInterface[]> {
    return await this.messageModel
      .find({ roomId })
      .select('-__v -createdAt -updatedAt')
      .populate('ownerId', 'fullName')
      .lean();
  }

  async getRoomByDoctorIdAndPatientId(
    doctorId: string,
    patientId: string,
  ): Promise<RoomInterface> {
    const room = await this.roomModel
      .findOne({ doctorId, patientId })
      .populate('patientId')
      .populate('doctorId')
      .lean();

    const messages = await this.messageModel
      .find({ roomId: room._id })
      .sort({ createdAt: -1 })
      .lean();

    return {
      ...room,
      messages,
    };
  }

  async editMessage(
    roomId: string,
    messageId: string,
    content: string,
  ): Promise<void> {
    await this.messageModel
      .findOneAndUpdate({ _id: messageId, roomId }, { content })
      .lean();
  }

  async deleteMessage(roomId: string, messageId: string): Promise<void> {
    await this.messageModel.findOneAndDelete({ _id: messageId, roomId });
  }

  async getMessageById(messageId: string): Promise<MessageInterface> {
    return await this.messageModel.findById(messageId).lean();
  }

  async getRooms(userId: string): Promise<RoomInterface[]> {
    const rooms = await this.roomModel
      .find({ $or: [{ doctorId: userId }, { patientId: userId }] })
      .populate('patientId')
      .populate('doctorId')
      .lean();

    const roomsWithLastMessages = await Promise.all(
      rooms.map(async (room) => {
        const lastMessage = await this.messageModel
          .findOne({ roomId: room._id })
          .sort({ createdAt: -1 })
          .lean();
        return { ...room, lastMessage };
      }),
    );

    return roomsWithLastMessages;
  }
}
