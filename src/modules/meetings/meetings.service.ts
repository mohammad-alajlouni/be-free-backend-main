import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Meeting } from './schema/meeting.schema';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ListMeetingsDto, MeetingDto } from './dto/meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel('Meeting') private readonly meetingModel: Model<Meeting>,
  ) {}

  async create(payload: MeetingDto) {
    const id = new mongoose.Types.ObjectId().toString();

    await this.meetingModel.create({
      ...payload,
      _id: id,
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Meeting created successfully',
    };
  }

  async findAll(payload: ListMeetingsDto): Promise<any> {
    const { page = 1, size = 20, search = '', isRecorded } = payload;

    const correctedPage = Math.max(page, 1);

    const pipeline: PipelineStage[] = [
      // Apply search
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { title: { $regex: search, $options: 'i' } },
                  { description: { $regex: search, $options: 'i' } },
                ],
              },
            },
          ]
        : []),
      // Apply isRecorded filter
      ...(isRecorded
        ? [
            {
              $match: {
                isRecorded: Boolean(isRecorded),
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: 'users', // Name of the User collection
          localField: 'doctorId', // Field in the meeting collection
          foreignField: '_id', // Field in the User collection
          as: 'doctorData', // Output array field
        },
      },
      // Unwind doctorData array to a single object
      {
        $unwind: {
          path: '$doctorData',
          preserveNullAndEmptyArrays: true, // Keep meetings even if no doctor is found
        },
      },
      // Project the desired fields
      {
        $project: {
          title: 1,
          thumbnail: 1,
          isRecorded: 1,
          doctorData: {
            fullName: '$doctorData.fullName',
            profilePicture: '$doctorData.profilePicture',
            specialization: '$doctorData.specialization',
          },
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

    const [{ items, count }] = await this.meetingModel.aggregate(pipeline);

    return {
      success: true,
      statusCode: 200,
      message: 'Meetings retrieved successfully',
      data: { items, count: count.length > 0 ? count[0].count : 0 },
    };
  }

  async findOne(id: string): Promise<any> {
    const pipeline: PipelineStage[] = [
      // Match the meeting by ID
      {
        $match: { _id: id },
      },
      // Lookup doctor information
      {
        $lookup: {
          from: 'users', // The name of the doctor collection
          localField: 'doctorId', // Field in the meeting collection
          foreignField: '_id', // Field in the doctor collection
          as: 'doctorInfo', // Output array field
        },
      },
      // Unwind doctorInfo array to a single object
      {
        $unwind: {
          path: '$doctorInfo',
          preserveNullAndEmptyArrays: true, // Keep the meeting even if no doctor is found
        },
      },
      // Project the desired fields
      {
        $project: {
          title: 1,
          thumbnail: 1,
          video: 1,
          description: 1,
          goals: 1,
          isRecorded: 1,
          'doctorInfo.fullName': 1,
          'doctorInfo.profilePicture': 1,
          'doctorInfo.specialization': 1,
          createdAt: 1,
        },
      },
    ];

    const result = await this.meetingModel.aggregate(pipeline);

    if (!result || result.length === 0) {
      throw new HttpException('Meeting not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Meeting found',
      data: result[0], // Aggregation returns an array, get the first item
    };
  }

  async updateOne(id: string, payload: MeetingDto) {
    const meeting = await this.meetingModel.findOne({
      _id: id,
    });

    if (!meeting) {
      throw new HttpException('Meeting not found', HttpStatus.NOT_FOUND);
    }

    await this.meetingModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...payload,
        },
      },
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Meeting updated successfully',
    };
  }

  async deleteOne(id: string) {
    const meeting = await this.meetingModel.findOne({
      _id: id,
    });

    if (!meeting) {
      throw new HttpException('Meeting not found', HttpStatus.NOT_FOUND);
    }

    await this.meetingModel.deleteOne({
      _id: id,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Meeting deleted successfully',
    };
  }
}
