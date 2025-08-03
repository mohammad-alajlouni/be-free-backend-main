import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConsultationsService } from './consultation.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ConsultationDto, ListConsultationsDto } from './dto/consultation.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import {
  apiBadRequestResponse,
  apiUnauthorizedResponse,
  apiForbiddenResponse,
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
} from 'src/swagger/error.swagger';
import {
  CreateConsultationResponseDto,
  GetOneConsultationResponseDto,
  ListConsultationsResponseDto,
} from 'src/swagger/consultation/consultation.swagger';
import { RolesGuard } from '../auth/roles-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/users.enums';
import { ProfileCompleteGuard } from 'src/guards/profile-complete-guard';

@ApiTags('Consultations')
@UseGuards(RolesGuard)
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT)
  @UseGuards(ProfileCompleteGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new consultation - PATIENT' })
  @ApiResponse({
    status: 201,
    description: 'Create new consultation.',
    type: CreateConsultationResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async create(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() consultationDto: ConsultationDto,
  ) {
    try {
      return this.consultationsService.create(currentUser.id, consultationDto);
    } catch (e) {
      throw new HttpException(
        'Error creating consultation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @Get('list')
  @ApiOperation({ summary: 'List all consultations - DOCTOR' })
  @ApiResponse({
    status: 200,
    description: 'List all consultations.',
    type: ListConsultationsResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findAll(
    @CurrentUser() currentUser: CurrentUserDto,
    @Query() listConsultationsDto: ListConsultationsDto,
  ) {
    try {
      return this.consultationsService.findAll(
        currentUser,
        listConsultationsDto,
      );
    } catch (e) {
      throw new HttpException(
        'Error retrieving consultations',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @Get(':consultationId')
  @ApiOperation({ summary: 'Get a single consultation by ID - DOCTOR' })
  @ApiResponse({
    status: 200,
    description: 'Get a single consultation by ID.',
    type: GetOneConsultationResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findOne(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('consultationId') id: string,
  ) {
    try {
      return this.consultationsService.findOne(currentUser, id);
    } catch (e) {
      throw new HttpException(
        'Error retrieving consultation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @Put(':consultationId/accept')
  @ApiOperation({ summary: 'Accept consultation - DOCTOR' })
  async acceptConsultation(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('consultationId') consultationId: string,
  ) {
    try {
      return this.consultationsService.acceptConsultation(
        currentUser.id,
        consultationId,
      );
    } catch (e) {
      throw new HttpException(
        e.message || 'Error accepting consultation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @Put(':consultationId/reject')
  @ApiOperation({ summary: 'Reject consultation - DOCTOR' })
  async rejectConsultation(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('consultationId') consultationId: string,
  ) {
    try {
      return this.consultationsService.rejectConsultation(
        currentUser.id,
        consultationId,
      );
    } catch (e) {
      throw new HttpException(
        e.message || 'Error rejecting consultation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
