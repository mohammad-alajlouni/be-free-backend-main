import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { UserRole } from 'src/enums/users.enums';
import {
  apiBadRequestResponse,
  apiUnauthorizedResponse,
  apiForbiddenResponse,
  apiNotFoundResponse,
  apiInternalServerErrorResponse,
} from 'src/swagger/error.swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles-auth.guard';
import {
  apiOkResponse,
  apiUpdateResponse,
} from 'src/swagger/patient/patient.swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { NoteDto } from '../notes/dto/note.dto';
import {
  NoteCreatedResponseDto,
  NoteResponseDto,
} from 'src/swagger/notes/notes.swagger';
import { CompletePatientDto, PatientDto } from './dto/patient.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Patients')
@UseGuards(RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @Post(':patientId/notes')
  @ApiOperation({ summary: 'Add a note to patient profile' })
  @ApiResponse({
    status: 201,
    description: 'Note added',
    type: NoteCreatedResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async addNote(
    @Param('patientId') id: string,
    @Body() noteDto: NoteDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    try {
      return this.patientsService.addNote(id, noteDto, user);
    } catch (e) {
      throw new HttpException('Error adding note', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @Get(':patientId')
  @ApiOperation({ summary: 'Get your notes on patient profile' })
  @ApiResponse({
    status: 200,
    description: 'Notes retrieved',
    type: [NoteResponseDto],
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async getUserNotes(
    @Param('patientId') id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    try {
      return this.patientsService.getUserNotes(id, user);
    } catch (e) {
      throw new HttpException('Error retrieving notes', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT)
  @Patch('/data-completion')
  @ApiOperation({ summary: 'Complete patient data' })
  @ApiResponse(apiOkResponse)
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async completePatientData(
    @Body() patientDto: CompletePatientDto,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    try {
      return this.patientsService.completePatientData(currentUser, patientDto);
    } catch (e) {
      throw new HttpException(
        'Error completing patient data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT)
  @Patch('/profile')
  @UseInterceptors(FileInterceptor('profilePicture'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update patient profile' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string' },
        email: { type: 'string' },
        gender: { type: 'number' },
        maritalStatus: { type: 'number' },
        birthdate: { type: 'string', format: 'date-time' },
        profilePicture: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse(apiUpdateResponse)
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async updatePatientProfile(
    @Body() patientDto: PatientDto,
    @CurrentUser() currentUser: CurrentUserDto,
    @UploadedFile() profilePicture?: Express.Multer.File,
  ) {
    try {
      return this.patientsService.updatePatientProfile(
        currentUser,
        patientDto,
        profilePicture,
      );
    } catch (e) {
      throw new HttpException(
        'Error completing patient data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
