import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './schema/note.schema';
import mongoose, { Model } from 'mongoose';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { NoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel('Note') private readonly noteModel: Model<Note>) {}

  async addNote(
    patientId: string,
    payload: NoteDto,
    user: CurrentUserDto,
  ): Promise<any> {
    await this.noteModel.create({
      _id: new mongoose.Types.ObjectId().toString(),
      ...payload,
      psychologistId: user.id,
      patientId: patientId,
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Note added',
    };
  }

  async getUserNotes(patientId: string, user: CurrentUserDto) {
    const notes = await this.noteModel.find({
      patientId,
      psychologistId: user.id,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Patient notes retrieved successfully',
      data: notes,
    };
  }
}
