import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { sendOtpDto } from './dto/sendOtp.dto';
import { LoginDto } from './dto/login.dto';
import { TwilioService } from '../twilio/twilio.service';
import { UserRole } from 'src/enums/users.enums';
import { PatientsService } from '../patients/patients.service';
import { CurrentUserDto } from './dto/currentUser.dto';
import { UpdateProfileDto } from '../users/dto/updateProfile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly patientsService: PatientsService,
    private readonly twilioService: TwilioService,
  ) {}

  async register(registerDto: RegisterDto, files: any) {
    await this.usersService.createUser(registerDto, files);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message:
        'Your application has been submitted successfully. We will review your application and get back to you soon.',
    };
  }

  async login(body: LoginDto) {
    const { mobile, otp, role } = body;
    let user: any;

    if (role === UserRole.PSYCHOLOGIST) {
      user = await this.usersService.findOneByMobile(mobile);
      if (!user) {
        throw new HttpException('Invalid mobile number for psychologist', HttpStatus.UNAUTHORIZED);
      }
      if (!user.isActivated) {
        throw new HttpException('Psychologist account is not activated yet.', HttpStatus.UNAUTHORIZED);
      }
      if (user.otp !== otp) {
        throw new HttpException('Invalid OTP for psychologist', HttpStatus.UNAUTHORIZED);
      }
    } else if (role === UserRole.PATIENT) {
      user = await this.patientsService.findOneByMobile(mobile);
      if (!user) {
        throw new HttpException('Invalid mobile number for patient', HttpStatus.UNAUTHORIZED);
      }
      if (user.otp !== otp) {
        throw new HttpException('Invalid OTP for patient', HttpStatus.UNAUTHORIZED);
      }
      if (!user.isActivated) {
        throw new HttpException('Patient account is not activated yet.', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    if (role === UserRole.PSYCHOLOGIST) {
      await this.usersService.clearOtp(mobile);
    } else if (role === UserRole.PATIENT) {
      await this.patientsService.clearOtp(mobile);
    }

    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      mobile: user.mobile,
      role: user.role,
      profilePicture: user.profilePicture,
      gender: user.gender,
    };

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `${role === UserRole.PATIENT ? 'Patient' : 'Psychologist'} successfully logged in`,
      data: {
        token: this.jwtService.sign(payload),
        user: payload,
      },
    };
  }

  async sendOtp(sendOtpDto: sendOtpDto) {
    const { mobile, role, channel } = sendOtpDto;

    if (role === UserRole.PSYCHOLOGIST) {
      const user = await this.usersService.findOneByMobile(mobile);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (!user.isActivated) {
        throw new HttpException('Your account is not activated yet.', HttpStatus.UNAUTHORIZED);
      }

      const otp = await this.usersService.generateOtp(mobile);
      await this.twilioService.sendOtp(mobile, otp, channel);

      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'OTP sent to mobile successfully',
      };
    } else if (role === UserRole.PATIENT) {
      const patient = await this.patientsService.findOneByMobile(mobile);

      if (!patient) {
        await this.patientsService.createPatient(mobile);
        const otp = await this.patientsService.generateOtp(mobile);
        await this.twilioService.sendOtp(mobile, otp, channel);

        return {
          success: true,
          statusCode: HttpStatus.CREATED,
          message: 'Patient registered and OTP sent to mobile successfully',
        };
      } else {
        const otp = await this.patientsService.generateOtp(mobile);
        await this.twilioService.sendOtp(mobile, otp, channel);

        return {
          success: true,
          statusCode: HttpStatus.OK,
          message: 'OTP sent to mobile successfully',
        };
      }
    } else {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteAccount(userId: string, role: UserRole) {
    let user: any;

    if (role === UserRole.PSYCHOLOGIST) {
      user = await this.usersService.findOneById(userId);
      if (!user) {
        throw new HttpException('Psychologist not found', HttpStatus.NOT_FOUND);
      }
      await this.usersService.deleteUser(userId);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Psychologist account deleted successfully',
      };
    } else if (role === UserRole.PATIENT) {
      user = await this.patientsService.findOneById(userId);
      if (!user) {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }
      await this.patientsService.deletePatient(userId);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Patient account deleted successfully',
      };
    } else {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }
  }

  async getProfile(currentUser: CurrentUserDto) {
    let user: any;

    if (currentUser.role === 1) {
      user = await this.usersService.getDoctorProfile(currentUser);
    } else {
      user = await this.patientsService.getPatientProfile(currentUser);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      data: user,
    };
  }

  async updateProfile(currentUser: CurrentUserDto, payload: UpdateProfileDto) {
    const psychologist = await this.usersService.getDoctorProfile(currentUser);
    if (!psychologist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const res = await this.usersService.updateProfile(currentUser.id, payload);
    return {
      ...res,
    };
  }
}