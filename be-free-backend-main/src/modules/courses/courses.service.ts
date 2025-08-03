import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Course } from './schema/course.schema';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ListCoursesDto, CourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel('Course') private readonly courseModel: Model<Course>,
  ) {}

  async create(payload: CourseDto) {
    const id = new mongoose.Types.ObjectId().toString();

    await this.courseModel.create({
      ...payload,
      _id: id,
      numberOfPatients: Math.floor(Math.random() * 100) + 1,
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Course created successfully',
    };
  }

  async findAll(payload: ListCoursesDto): Promise<any> {
    const { page = 1, size = 20, search = '' } = payload;

    const correctedPage = Math.max(page, 1);

    const pipeline: PipelineStage[] = [
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
      {
        $lookup: {
          from: 'users',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctorDetails',
        },
      },
      {
        $unwind: {
          path: '$doctorDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          images: 1,
          videos: 1,
          description: 1,
          price: 1,
          goals: 1,
          numberOfPatients: 1,
          'doctorDetails.fullName': 1,
          'doctorDetails.profilePicture': 1,
          'doctorDetails.specialization': 1,
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

    const [{ items, count }] = await this.courseModel.aggregate(pipeline);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Courses retrieved successfully',
      data: { items, count: count.length > 0 ? count[0].count : 0 },
    };
  }

  async findOne(id: string): Promise<any> {
    // Define the pipeline
    const pipeline: PipelineStage[] = [
      {
        $match: { _id: id }, // Match the course by ID
      },
      {
        $lookup: {
          from: 'users', // The name of the doctor collection
          localField: 'doctorId', // Field in the course collection
          foreignField: '_id', // Field in the doctor collection
          as: 'doctorInfo', // Output array field
        },
      },
      {
        $unwind: {
          path: '$doctorInfo',
          preserveNullAndEmptyArrays: true, // Keep course even if no doctor is found
        },
      },
      {
        $project: {
          title: 1,
          images: 1,
          videos: 1,
          description: 1,
          numberOfPatients: 1,
          price: 1,
          goals: 1,
          'doctorInfo.fullName': 1,
          'doctorInfo.profilePicture': 1,
          'doctorInfo.specialization': 1,
        },
      },
    ];

    // Run the aggregation
    const [course] = await this.courseModel.aggregate(pipeline);

    // Handle not found
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Course found',
      data: course,
    };
  }

  async updateOne(id: string, payload: CourseDto) {
    const course = await this.courseModel.findOne({
      _id: id,
    });

    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    await this.courseModel.updateOne(
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
      message: 'Course updated successfully',
    };
  }

  async deleteOne(id: string) {
    const course = await this.courseModel.findOne({
      _id: id,
    });

    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    await this.courseModel.deleteOne({
      _id: id,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Course deleted successfully',
    };
  }
}
