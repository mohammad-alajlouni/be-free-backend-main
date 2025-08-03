import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Patient } from './schema/patient.schema';
import * as crypto from 'crypto';
import { UserRole } from 'src/enums/users.enums';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { NoteDto } from '../notes/dto/note.dto';
import { NotesService } from '../notes/notes.service';
import { CompletePatientDto, PatientDto } from './dto/patient.dto';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel('Patient') private readonly patientModel: Model<Patient>,
    private readonly notesService: NotesService,
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  // Method to create a patient (only when the patient is new)
  async createPatient(mobile: string): Promise<any> {
    // Check if the patient already exists
    const patient = await this.patientModel.findOne({ mobile });
    if (patient) {
      throw new HttpException('Mobile is already in use!', HttpStatus.CONFLICT);
    }

    await this.patientModel.create({
      _id: new mongoose.Types.ObjectId().toString(),
      mobile,
      isActivated: true,
      role: UserRole.PATIENT,
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Patient created',
    };
  }

  // Generate OTP for patient login
  async generateOtp(mobile: string): Promise<any> {
    const patient = await this.patientModel.findOne({ mobile });

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    // const otp = crypto.randomInt(100000, 999999).toString();
    const otp = '123456';
    patient.otp = otp;
    await patient.save();

    return otp;
  }

  // Clear the OTP after successful login or expiration
  async clearOtp(mobile: string): Promise<any> {
    const patient = await this.patientModel.findOne({ mobile });

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    await this.patientModel.updateOne({ mobile }, { $set: { otp: null } });

    return { success: true, statusCode: HttpStatus.OK, message: 'OTP cleared' };
  }

  // Find a patient by their mobile number
  async findOneByMobile(mobile: string): Promise<any> {
    const patient = await this.patientModel.findOne({ mobile });

    return patient;
  }

  async findOneById(id: string): Promise<any> {
    return await this.patientModel.findOne({ _id: id });
  }

  // Find all patients in the collection
  async findAllPatients(): Promise<any> {
    const patients = await this.patientModel.find();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Patients found',
      data: patients,
    };
  }

  async getPatientProfile(currentUser: CurrentUserDto): Promise<any> {
    const patientId = currentUser.id;

    const patient = await this.patientModel
      .findById(patientId)
      .select('-__v -createdAt -updatedAt -password -otp -isActivated -role')
      .lean();

    if (!patient) throw new HttpException('Patient not found', 404);

    return {
      success: true,
      statusCode: 200,
      message: 'patient data fetched successfully',
      data: patient,
    };
  }

  // Update patient profile (e.g., in case they want to modify details)
  async updateProfile(id: string, payload: any) {
    const patient = await this.patientModel.findOne({ _id: id });

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    await this.patientModel.updateOne({ _id: id }, { $set: { ...payload } });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Patient profile updated successfully',
    };
  }

  // Delete patient by ID
  async deletePatient(id: string) {
    const patient = await this.patientModel.findOne({ _id: id });

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    await this.patientModel.deleteOne({ _id: id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Patient deleted successfully',
    };
  }

  async addNote(patientId: string, payload: NoteDto, user: CurrentUserDto) {
    const patient = await this.patientModel.findById({
      _id: patientId,
    });

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    await this.notesService.addNote(patientId, payload, user);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Note added successfully',
    };
  }

  async getUserNotes(patientId: string, user: CurrentUserDto) {
    const patient = await this.patientModel.findById({
      _id: patientId,
    });

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    const notes = await this.notesService.getUserNotes(patientId, user);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Notes retrieved successfully',
      data: notes,
    };
  }

  async completePatientData(
    currentUser: CurrentUserDto,
    completedData: CompletePatientDto,
  ): Promise<any> {
    const patientId = currentUser.id;

    const patient = await this.patientModel.findById({
      _id: patientId,
    });
    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    const updatedPatient = await this.patientModel.findOneAndUpdate(
      { _id: patientId },
      { $set: { ...completedData } },
      {
        new: true,
        select: '-__v -createdAt -updatedAt -otp',
      },
    );

    const payload = {
      id: updatedPatient._id,
      email: updatedPatient.email,
      fullName: updatedPatient.fullName,
      mobile: updatedPatient.mobile,
      role: updatedPatient.role,
      profilePicture: updatedPatient.profilePicture,
      gender: updatedPatient.gender,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      statusCode: 200,
      message: 'Patient data updated successfully',
      data: token,
    };
  }

  async updatePatientProfile(
    currentUser: CurrentUserDto,
    patientProfile: PatientDto,
    profilePictureFile?: any,
  ): Promise<any> {
    const patientId = currentUser.id;

    let profilePicture: any;

    if (profilePictureFile) {
      const url = await this.supabaseService.uploadToSupabase({
        buffer: profilePictureFile.buffer,
        fileName: profilePictureFile.originalname,
        mimeType: profilePictureFile.mimetype,
        instance: 'images',
        userId: patientId,
      });
      profilePicture = url;
    }

    const updatedPatient = await this.patientModel
      .findByIdAndUpdate(patientId, {
        $set: {
          ...patientProfile,
          profilePicture,
        },
      })
      .lean();

    if (!updatedPatient)
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);

    const payload = {
      id: currentUser.id,
      email: patientProfile.email,
      fullName: patientProfile.fullName,
      mobile: currentUser.mobile,
      role: currentUser.role,
      profilePicture: updatedPatient.profilePicture,
      gender: currentUser.gender,
      maritalStatus: updatedPatient.maritalStatus,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      statusCode: 200,
      message: 'Patient data updated successfully',
      data: token,
    };
  }
}
