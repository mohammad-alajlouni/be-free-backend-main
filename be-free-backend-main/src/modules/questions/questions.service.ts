import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { Question } from './schema/question.schema';
import {
  QuestionDto,
  ListQuestionsDto,
  AnswerQuestionDto,
} from './dto/question.dto';
import { QuestionStatus } from 'src/enums/questions.enums';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { UserRole } from 'src/enums/users.enums';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<Question>,
  ) {}

  async create(userId: string, payload: QuestionDto) {
    const id = new mongoose.Types.ObjectId().toString();

    const question = await this.questionModel.create({
      _id: id,
      userId,
      status: QuestionStatus.NOT_ANSWERED,
      question: payload.question,
    });

    return {
      success: true,
      statusCode: 201,
      message: 'Question created successfully',
      data: question,
    };
  }

  async findAll(currentUser: CurrentUserDto, payload: ListQuestionsDto) {
    const { page = 1, size = 4, status } = payload;

    const correctedPage = Math.max(page, 1);

    const pipeline: PipelineStage[] = [
      ...(status ? [{ $match: { status } }] : []),
      ...(currentUser.role === UserRole.PATIENT
        ? [{ $match: { userId: currentUser.id } }]
        : []),
      {
        $lookup: {
          from: 'patients',
          localField: 'userId',
          foreignField: '_id',
          as: 'patientData',
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          items: [{ $skip: (+correctedPage - 1) * +size }, { $limit: +size }],
          count: [{ $count: 'count' }],
        },
      },
    ];

    const [{ items, count }] = await this.questionModel.aggregate(pipeline);

    return {
      success: true,
      statusCode: 200,
      message: 'Questions retrieved successfully',
      data: {
        items,
        count: count.length > 0 ? count[0].count : 0,
      },
    };
  }

  async findOne(id: string) {
    const pipeline: PipelineStage[] = [
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'patients',
          localField: 'userId',
          foreignField: '_id',
          as: 'patientData',
        },
      },
      { $limit: 1 },
    ];

    const result = await this.questionModel.aggregate(pipeline);

    if (!result || result.length === 0) {
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    const question = result[0];

    return {
      success: true,
      statusCode: 200,
      message: 'Question retrieved successfully',
      data: question,
    };
  }

  async answerQuestion(id: string, payload: AnswerQuestionDto) {
    const question = await this.questionModel.findOne({
      _id: id,
    });

    if (!question) {
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    await this.questionModel.updateOne(
      { _id: id },
      {
        $set: {
          answer: payload.answer,
          status: QuestionStatus.ANSWERED,
        },
      },
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Answer submitted successfully',
    };
  }
}
