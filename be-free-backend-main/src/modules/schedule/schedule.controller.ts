import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ScheduleService } from './schedule.service';
import {
  ApiBearerAuth,
  ApiProduces,
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { GetDoctorSchedule, ScheduleDto } from './dto/schedule.dto';
import {
  apiBadRequestResponse,
  apiForbiddenResponse,
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
  apiUnauthorizedResponse,
} from 'src/swagger/error.swagger';
import {
  apiCreatedScheduleResponse,
  apiDoctorIdParam,
  apiGetAvailableTimes,
  apiGetScheduleResponse,
} from 'src/swagger/schedule/schedule.swagger';
import { RolesGuard } from '../auth/roles-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/users.enums';

@ApiProduces('application/json')
@ApiTags('Schedules')
@UseGuards(RolesGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @ApiOperation({ summary: 'Create or update doctor schedule' })
  @ApiCreatedResponse(apiCreatedScheduleResponse)
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @Post()
  createOrUpdateSchedule(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() body: ScheduleDto,
  ) {
    return this.scheduleService.createOrUpdateSchedule(res, body, currentUser);
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST, UserRole.PATIENT)
  @ApiOkResponse(apiGetScheduleResponse)
  @ApiOperation({ summary: 'List all doctor schedules' })
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @Get()
  getDoctorSchedules(
    @CurrentUser() currentUser: CurrentUserDto,
    @Query() payload: GetDoctorSchedule,
  ) {
    return this.scheduleService.getDoctorSchedule(currentUser, payload);
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @ApiOkResponse(apiGetAvailableTimes)
  @ApiOperation({ summary: 'Get doctor schedules for available times' })
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiParam(apiDoctorIdParam)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @Get('available-times/:doctorId')
  getDoctorAvailableTimes(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('doctorId') doctorId: string,
  ) {
    return this.scheduleService.getDoctorAvailableTimes(currentUser, doctorId);
  }
}
