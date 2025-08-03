import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { sendOtpDto } from './dto/sendOtp.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  apiBadRequestResponse,
  apiConflictResponse,
  apiForbiddenResponse,
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
  apiUnauthorizedResponse,
} from 'src/swagger/error.swagger';
import { Throttle } from '@nestjs/throttler';
import { UpdateUserResponseDto } from 'src/swagger/users/users.swagger';
import { CurrentUserDto } from './dto/currentUser.dto';
import { UpdateProfileDto } from '../users/dto/updateProfile.dto';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
      { name: 'classificationFile', maxCount: 1 },
      { name: 'lastDegree', maxCount: 1 },
      { name: 'nationalId', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string' },
        mobile: { type: 'string' },
        email: { type: 'string' },
        gender: { type: 'number' },
        birthdate: { type: 'string', format: 'date-time' },
        languages: { type: 'array', items: { type: 'string' } },
        country: { type: 'string' },
        city: { type: 'string' },
        degree: { type: 'string' },
        university: { type: 'string' },
        graduationYear: { type: 'string' },
        specialization: { type: 'string' },
        yearsOfExperience: { type: 'string' },
        classification: { type: 'string' },
        classificationExpiry: { type: 'string', format: 'date-time' },
        consultationType: { type: 'string' },
        profilePicture: { type: 'string', format: 'binary' },
        cv: { type: 'string', format: 'binary' },
        classificationFile: { type: 'string', format: 'binary' },
        lastDegree: { type: 'string', format: 'binary' },
        nationalId: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'User registered successfully' },
      },
    },
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiConflictResponse(apiConflictResponse)
  async register(
    @Request() req: any,
    @Body() registerDto: RegisterDto,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      cv?: Express.Multer.File[];
      classificationFile?: Express.Multer.File[];
      lastDegree?: Express.Multer.File[];
      nationalId?: Express.Multer.File[];
    },
  ) {
    try {
      return this.authService.register(req.body, files);
    } catch (e) {
      throw new HttpException('Error registering user', HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'User logged in successfully' },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                fullName: { type: 'string' },
                mobile: { type: 'string' },
                role: { type: 'number' },
                profilePicture: { type: 'string' },
                gender: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  async login(@Body() loginDto: LoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (e) {
      throw new HttpException('Invalid mobile number', HttpStatus.UNAUTHORIZED);
    }
  }

  @Throttle(3, 122880)
  @Public()
  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to user mobile' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OTP sent successfully' },
      },
    },
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  async sendOtp(@Body() sendOtpDto: sendOtpDto) {
    try {
      return this.authService.sendOtp(sendOtpDto);
    } catch (e) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Throttle(3, 122880)
  @Public()
  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to user mobile' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OTP sent successfully' },
      },
    },
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  async resendOtp(@Body() sendOtpDto: sendOtpDto) {
    try {
      return this.authService.sendOtp(sendOtpDto);
    } catch (e) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get profile data' })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: {
          type: 'string',
          example: 'User profile retrieved successfully',
        },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            mobile: { type: 'string' },
            role: { type: 'number' },
            profilePicture: { type: 'string' },
            gender: { type: 'number' },
            iat: { type: 'number' },
            exp: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  getProfile(@CurrentUser() currentUser: CurrentUserDto) {
    try {
      return this.authService.getProfile(currentUser);
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth()
  @Put('profile')
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({
    status: 200,
    description: 'Psychologist profile updated successfully',
    type: UpdateUserResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async updateProfile(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() updatesData: UpdateProfileDto,
  ) {
    try {
      return this.authService.updateProfile(currentUser, updatesData);
    } catch (e) {
      throw new HttpException(
        'Unable to update user profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Delete('delete-account')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Account deleted successfully' },
      },
    },
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  async deleteAccount(@Request() req: any) {
    try {
      return this.authService.deleteAccount(req.user.id, req.user.role);
    } catch (e) {
      throw new HttpException(
        'Unable to delete account',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}