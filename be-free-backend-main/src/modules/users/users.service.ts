import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './schemas/user.schema';
import { UserCountSchema } from './schemas/UserCount.schema';
import { RegisterDto } from '../auth/dto/register.dto';
import * as crypto from 'crypto';
import { UserRole } from 'src/enums/users.enums';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { Patient } from '../patients/schema/patient.schema';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Patient') private readonly patientModel: Model<Patient>,
    @InjectModel('UserCountSchema')
    private readonly userCountModel: Model<typeof UserCountSchema>,
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(payload: RegisterDto, files: any): Promise<any> {
    const { mobile } = payload;

    // Check if the user already exists
    const user = await this.userModel.findOne({ mobile });
    if (user) {
      throw new HttpException('Mobile is already in use!', HttpStatus.CONFLICT);
    }

    const newUserId = new mongoose.Types.ObjectId().toString();

    // Initialize variables for file attachment IDs
    let profilePicture: string;
    let cv: string;
    let classificationFile: string;
    let lastDegree: string;
    let nationalId: string;

    // Save attachments if they exist
    if (files.profilePicture?.[0]) {
      const url = await this.supabaseService.uploadToSupabase({
        buffer: files.profilePicture[0].buffer,
        fileName: files.profilePicture[0].originalname,
        mimeType: files.profilePicture[0].mimetype,
        instance: 'images',
        userId: newUserId,
      });
      profilePicture = url;
    }
    if (files.cv?.[0]) {
      const url = await this.supabaseService.uploadToSupabase({
        buffer: files.cv[0].buffer,
        fileName: files.cv[0].originalname,
        mimeType: files.cv[0].mimetype,
        instance: 'files',
        userId: newUserId,
      });
      cv = url;
    }
    if (files.classificationFile?.[0]) {
      const url = await this.supabaseService.uploadToSupabase({
        buffer: files.classificationFile[0].buffer,
        fileName: files.classificationFile[0].originalname,
        mimeType: files.classificationFile[0].mimetype,
        instance: 'files',
        userId: newUserId,
      });
      classificationFile = url;
    }
    if (files.lastDegree?.[0]) {
      const url = await this.supabaseService.uploadToSupabase({
        buffer: files.lastDegree[0].buffer,
        fileName: files.lastDegree[0].originalname,
        mimeType: files.lastDegree[0].mimetype,
        instance: 'files',
        userId: newUserId,
      });
      lastDegree = url;
    }
    if (files.nationalId?.[0]) {
      const url = await this.supabaseService.uploadToSupabase({
        buffer: files.nationalId[0].buffer,
        fileName: files.nationalId[0].originalname,
        mimeType: files.nationalId[0].mimetype,
        instance: 'files',
        userId: newUserId,
      });
      nationalId = url;
    }

    // Create the new user
    await this.userModel.create({
      ...payload,
      _id: newUserId,
      isActivated: true,
      role: UserRole.PSYCHOLOGIST,
      profilePicture,
      cv,
      classificationFile,
      lastDegree,
      nationalId,
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'New user created',
    };
  }

  async updateProfile(
    currentUserId: string,
    profile: UpdateProfileDto,
  ): Promise<any> {
    const userId = currentUserId;

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, {
        $set: {
          ...profile,
        },
      })
      .lean();

    if (!updatedUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const payload = {
      id: updatedUser._id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      mobile: updatedUser.mobile,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      gender: updatedUser.gender,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      statusCode: 200,
      message: 'User data updated successfully',
      data: token,
    };
  }

 async generateOtp(mobile: string): Promise<string> {
  const user = await this.userModel.findOne({ mobile });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  await user.save();

  return otp;
}


  async clearOtp(mobile: string): Promise<any> {
    const user = await this.findOneByMobile(mobile);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userModel.updateOne(
      { mobile },
      {
        $set: {
          otp: null,
        },
      },
    );

    return { success: true, statusCode: HttpStatus.OK, message: 'Otp cleared' };
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOneByEmail(email: string): Promise<User | null | undefined> {
    return await this.userModel.findOne({ email });
  }

  async findOneByMobile(mobile: string): Promise<User | null | undefined> {
    return await this.userModel.findOne({ mobile });
  }

  async findOneById(id: string): Promise<User | null | undefined> {
    return await this.userModel.findOne({ _id: id });
  }

  async findOne(id: string): Promise<User | null | undefined> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userModel.deleteOne({ _id: id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }

  async searchOrFilterDoctor(
    currentUser: CurrentUserDto,
    filters: [string, string, number, number, string, number, string],
    page: number,
    limit: number,
  ) {
    const [
      search,
      language,
      minPrice,
      maxPrice,
      specialization,
      gender,
      consultationType,
    ] = filters;
    const query: any = {};
    if (search) {
      query.$or = [{ fullName: { $regex: search, $options: 'i' } }];
    }
    if (language) query.languages = language;
    if (minPrice) query.price = { $gte: +minPrice };
    if (maxPrice) query.price = { $lte: +maxPrice };
    if (specialization) query.specialization = specialization;
    if (gender) query.gender = +gender;
    if (consultationType) query.consultationType = consultationType;

    const doctors = await this.userModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'doctorId',
          as: 'sessions',
        },
      },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'doctorId',
          as: 'ratings',
        },
      },
      {
        $addFields: {
          numberOfSessions: { $size: '$sessions' },
          rating: {
            $cond: {
              if: { $gt: [{ $size: '$ratings' }, 0] },
              then: {
                $divide: [
                  { $sum: '$ratings.doctorRating' },
                  { $size: '$ratings' },
                ],
              },
              else: 0,
            },
          },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          sessions: 0,
          ratings: 0,
        },
      },
    ]);

    return {
      success: true,
      statusCode: 200,
      message: 'Doctors fetched successfully',
      data: doctors,
    };
  }

  async getDoctorById(
    currentUser: CurrentUserDto,
    doctorId: string,
  ): Promise<any> {
    const doctor = await this.userModel
      .findById(doctorId)
      .select('-__v -createdAt -updatedAt -password -otp -isActivated -role')
      .lean();

    if (!doctor) throw new HttpException('Doctor not found', 404);

    if (currentUser.role === UserRole.PATIENT) {
      const body = {
        doctorId,
        patientId: currentUser.id,
        _id: new mongoose.Types.ObjectId().toString(),
      };
      await this.userCountModel.create(body);
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Doctor fetched successfully',
      data: doctor,
    };
  }

  async getDoctorProfile(currentUser: CurrentUserDto): Promise<any> {
    const doctorId = currentUser.id;

    const doctor = await this.userModel
      .findById(doctorId)
      .select('-__v -createdAt -updatedAt -password -otp -isActivated -role')
      .lean();

    if (!doctor) throw new HttpException('Doctor not found', 404);

    return {
      success: true,
      statusCode: 200,
      message: 'Doctor data fetched successfully',
      data: doctor,
    };
  }

  async getPatientById(patientId: string): Promise<any> {
    const patient = await this.patientModel
      .findById(patientId)
      .select('-__v -createdAt -updatedAt -otp -isActivated -role')
      .lean();

    if (!patient) throw new HttpException('Patient not found', 404);

    return {
      success: true,
      statusCode: 200,
      message: 'Patient data fetched successfully',
      data: patient,
    };
  }
}
