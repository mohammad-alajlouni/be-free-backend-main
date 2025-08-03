import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { Rating } from './schema/rating.schema';
import { ListRatingsDto, RatingDto } from './dto/rating.dto';
import { SessionService } from '../session/session.service';
import { UsersService } from '../users/users.service';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { UserRole } from 'src/enums/users.enums';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel('Rating') private readonly ratingModel: Model<Rating>,
    private readonly sessionService: SessionService,
    private readonly usersService: UsersService,
  ) {}

  async create(patientId: string, payload: RatingDto) {
    // check if session exists and status us completweed
    const session = await this.sessionService.checkIfSessionExistsAndCompleted(
      payload.sessionId,
    );

    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    // check if doctor is exist
    const doctor = await this.usersService.findOneById(payload.doctorId);

    if (!doctor) {
      throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
    }

    await this.ratingModel.create({
      _id: new mongoose.Types.ObjectId().toString(),
      patientId,
      ...payload,
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Rating created successfully',
    };
  }

  async findAll(
    currentUser: CurrentUserDto,
    payload: ListRatingsDto,
  ): Promise<any> {
    const { page = 1, size = 4, doctorId, sortOrder = 'desc' } = payload;

    const correctedPage = Math.max(page, 1);
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const pipeline: PipelineStage[] = [
      ...(currentUser.role === UserRole.PATIENT
        ? [{ $match: { doctorId } }]
        : [{ $match: { doctorId: currentUser.id } }]),

      //   get patiend name and profile pic
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patientDetails',
        },
      },
      {
        $unwind: {
          path: '$patientDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          patientId: 1,
          doctorId: 1,
          sessionRating: 1,
          doctorRating: 1,
          sessionComment: 1,
          doctorComment: 1,
          createdAt: 1,
          patientName: '$patientDetails.fullName',
          patientProfilePic: '$patientDetails.profilePicture',
        },
      },
      // Sort by createdAt
      { $sort: { createdAt: sortDirection } },
      {
        $facet: {
          items: [{ $skip: (+correctedPage - 1) * +size }, { $limit: +size }],
          count: [{ $count: 'count' }],
        },
      },
    ];

    const [{ items, count }] = await this.ratingModel.aggregate(pipeline);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Ratings fetched successfully',
      data: { items, count: count.length > 0 ? count[0].count : 0 },
    };
  }

  async findOne(id: string): Promise<any> {
    const pipeline: PipelineStage[] = [
      {
        $match: { _id: id },
      },
      // Get patient name and profile pic
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patientDetails',
        },
      },
      {
        $unwind: {
          path: '$patientDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          patientId: 1,
          doctorId: 1,
          sessionRating: 1,
          doctorRating: 1,
          sessionComment: 1,
          doctorComment: 1,
          createdAt: 1,
          patientName: '$patientDetails.fullName',
          patientProfilePic: '$patientDetails.profilePicture',
        },
      },
    ];

    const [rating] = await this.ratingModel.aggregate(pipeline);

    if (!rating) {
      throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Rating fetched successfully',
      data: rating,
    };
  }
}
