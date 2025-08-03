import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatRepository } from './repository/chat.repository';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async getRoomByDoctorIdAndPatientId(
    patientId: string,
    doctorId: string,
  ): Promise<any> {
    const room = await this.chatRepository.getRoomByDoctorIdAndPatientId(
      doctorId,
      patientId,
    );

    if (!room) throw new HttpException('Room not found', HttpStatus.NOT_FOUND);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Room created',
      data: room._id,
    };
  }
  async createRoom(patientId: string, doctorId: string): Promise<any> {
    let room = await this.chatRepository.getRoomByDoctorIdAndPatientId(
      doctorId,
      patientId,
    );
    if (!room) room = await this.chatRepository.createRoom(patientId, doctorId);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Room created',
      data: room,
    };
  }

  async getRoomById(roomId: string): Promise<any> {
    const room = await this.chatRepository.getRoomById(roomId);

    if (!room) throw new HttpException('Room not found', HttpStatus.NOT_FOUND);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Room fetched',
      data: room,
    };
  }

  async deleteRoom(patientId: string, doctorId: string): Promise<any> {
    const room = await this.chatRepository.getRoomByDoctorIdAndPatientId(
      doctorId,
      patientId,
    );

    if (room) await this.chatRepository.deleteRoom(patientId, doctorId);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Room deleted',
    };
  }

  async createMessage(
    ownerId: string,
    roomId: string,
    content: string,
  ): Promise<any> {
    await this.chatRepository.createMessage(ownerId, roomId, content);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Message created',
    };
  }

  async getChatHistory(roomId: string): Promise<any> {
    const chatHistory =
      await this.chatRepository.getChatHistoryByRoomId(roomId);

    if (!chatHistory.length)
      throw new HttpException('Chat history not found', HttpStatus.NOT_FOUND);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Chat history fetched',
      data: chatHistory,
    };
  }

  async editMessage(
    currentUser: CurrentUserDto,
    roomId: string,
    messageId: string,
    content: string,
  ): Promise<any> {
    const userId = currentUser.id;
    const message = await this.chatRepository.getMessageById(messageId);

    if (userId !== message.ownerID) {
      throw new HttpException('Cannot edit message', HttpStatus.FORBIDDEN);
    }

    await this.chatRepository.editMessage(roomId, messageId, content);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Message edited',
    };
  }

  async deleteMessage(
    currentUser: CurrentUserDto,
    roomId: string,
    messageId: string,
  ): Promise<any> {
    const userId = currentUser.id;
    const message = await this.chatRepository.getMessageById(messageId);

    if (userId !== message.ownerID) {
      throw new HttpException('Cannot delete message', HttpStatus.FORBIDDEN);
    }

    await this.chatRepository.deleteMessage(roomId, messageId);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Message deleted',
    };
  }

  async getRooms(userId: string): Promise<any> {
    const rooms = await this.chatRepository.getRooms(userId);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Rooms fetched',
      data: rooms,
    };
  }
}
