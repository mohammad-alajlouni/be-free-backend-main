import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { Consultation } from './schema/consultation.schema';
import { ConsultationDto, ListConsultationsDto } from './dto/consultation.dto';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectModel('Consultation')
    private readonly consultationModel: Model<Consultation>,
  ) {}

  async create(patientId: string, payload: ConsultationDto) {
    const consultation = await this.consultationModel.create({
      ...payload,
      patientId,
      numberOfSessions: 1,
      sessionType: 'consultation',
      duration: 30,
      _id: new mongoose.Types.ObjectId().toString(),
    });

    return {
      success: true,
      statusCode: 201,
      message: 'Consultation created successfully',
      data: consultation,
    };
  }

  async findAll(currentUser: CurrentUserDto, payload: ListConsultationsDto) {
    const { page = 1, size = 4 } = payload;

    const correctedPage = Math.max(page, 1);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          gender: +currentUser.gender,
          status: { $ne: 'accepted' }, // Don't show accepted consultations
          rejectedBy: { $ne: currentUser.id }, // Exclude consultations rejected by the current doctor
        },
      },
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
          notes: 1,
          patientId: 1,
          sessionType: 1,
          duration: 1,
          numberOfSessions: 1,
          createdAt: 1,
          patientDetails: {
            fullName: 1,
            profilePicture: 1,
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

    const [{ items, count }] = await this.consultationModel.aggregate(pipeline);

    return {
      success: true,
      statusCode: 200,
      message: 'Consultations retrieved successfully',
      data: {
        items,
        count: count.length > 0 ? count[0].count : 0,
      },
    };
  }

  async findOne(currentUser: CurrentUserDto, id: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: id,
          gender: +currentUser.gender,
          status: { $ne: 'accepted' }, // Don't show accepted consultations
          rejectedBy: { $ne: currentUser.id }, // Exclude consultations rejected by the current doctor
        },
      },
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
          notes: 1,
          patientId: 1,
          sessionType: 1,
          duration: 1,
          numberOfSessions: 1,
          createdAt: 1,
          patientDetails: {
            fullName: 1,
            profilePicture: 1,
          },
        },
      },
      { $limit: 1 },
    ];

    const result = await this.consultationModel.aggregate(pipeline);

    if (!result || result.length === 0) {
      throw new HttpException('Consultation not found', HttpStatus.NOT_FOUND);
    }

    const consultation = result[0];

    return {
      success: true,
      statusCode: 200,
      message: 'Consultation retrieved successfully',
      data: consultation,
    };
  }

  // Accept Consultation
  async acceptConsultation(doctorId: string, consultationId: string) {
    const consultation = await this.consultationModel.findById(consultationId);

    // Check if another doctor already accepted it
    if (consultation.status === 'accepted') {
      throw new HttpException(
        'Consultation already accepted by another doctor',
        HttpStatus.CONFLICT,
      );
    }

    if (consultation.rejectedBy.includes(doctorId)) {
      throw new HttpException(
        'You already rejected this consultation',
        HttpStatus.CONFLICT,
      );
    }

    consultation.acceptedBy = doctorId;
    consultation.status = 'accepted';
    await consultation.save();

    return {
      success: true,
      statusCode: 200,
      message: 'Consultation accepted successfully',
    };
  }

  // Reject Consultation
  async rejectConsultation(doctorId: string, consultationId: string) {
    const consultation = await this.consultationModel.findById(consultationId);

    // Check if another doctor already accepted it
    if (consultation.status === 'accepted') {
      throw new HttpException(
        'Consultation already accepted by another doctor',
        HttpStatus.CONFLICT,
      );
    }

    if (!consultation.rejectedBy.includes(doctorId)) {
      consultation.rejectedBy.push(doctorId);
    }

    consultation.status = 'rejected';
    await consultation.save();

    return {
      success: true,
      statusCode: 200,
      message: 'Consultation rejected successfully',
    };
  }
}
