import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { SessionDto } from './dto/session.dto';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  apiCancelledSessionResponse,
  apiCompletedSessionResponse,
  apiCreatedSession,
  apiDoctorIdParam,
  apiSessionIdParam,
  apiSessionSearchQuery,
  apiSessionsLimit,
  apiStatusQuery,
  apiSessionsListResponse,
  apiSessionsPage,
  apiSingleSession,
} from 'src/swagger/session/session.swagger';
import {
  apiBadRequestResponse,
  apiConflictResponse,
  apiForbiddenResponse,
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
  apiUnauthorizedResponse,
} from 'src/swagger/error.swagger';
import { RolesGuard } from '../auth/roles-auth.guard';
import { UserRole } from 'src/enums/users.enums';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProfileCompleteGuard } from 'src/guards/profile-complete-guard';
import { UpdatedSessionDto } from './dto/updateSession.dto';

@ApiProduces('application/json')
@ApiTags('Sessions')
@UseGuards(RolesGuard)
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT)
  @UseGuards(ProfileCompleteGuard)
  @ApiOperation({ summary: 'Create new session from patient view' })
  @ApiParam(apiDoctorIdParam)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiConflictResponse(apiConflictResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiCreatedResponse(apiCreatedSession)
  @Post(':doctorId')
  createNewSession(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('doctorId') doctorId: string,
    @Body() body: SessionDto,
  ): object {
    return this.sessionService.createNewSession(currentUser, doctorId, body);
  }

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT)
  @ApiOperation({ summary: 'Cancel session from patient view' })
  @ApiParam(apiSessionIdParam)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiOkResponse(apiCancelledSessionResponse)
  @Patch(':sessionId/cancel')
  cancelSession(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('sessionId') sessionId: string,
  ): object {
    return this.sessionService.cancelSession(currentUser, sessionId);
  }

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT, UserRole.PSYCHOLOGIST)
  @ApiOperation({ summary: 'Complete session from both sides' })
  @ApiParam(apiSessionIdParam)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiOkResponse(apiCompletedSessionResponse)
  @Patch(':sessionId/complete')
  completeSession(@Param('sessionId') sessionId: string): object {
    return this.sessionService.completeSession(sessionId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one session' })
  @ApiParam(apiSessionIdParam)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiOkResponse(apiSingleSession)
  @Get(':sessionId')
  getOneSession(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('sessionId') sessionId: string,
  ): object {
    return this.sessionService.getOneSession(currentUser, sessionId);
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @ApiOperation({ summary: 'Get sessions list for doctor' })
  @ApiQuery(apiSessionsPage)
  @ApiQuery(apiSessionsLimit)
  @ApiQuery(apiSessionSearchQuery)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiOkResponse(apiSessionsListResponse)
  @Get('doctor/all')
  getDoctorSessionsList(
    @CurrentUser() currentUser: CurrentUserDto,
    @Query('status') status: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): object {
    return this.sessionService.getDoctorSessionsList(
      currentUser,
      status,
      page || 1,
      limit || 4,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @ApiOperation({ summary: 'Get next upcoming session for doctor' })
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiOkResponse(apiSingleSession)
  @Get('doctor/upcoming')
  getDoctorNextUpcomingSession(
    @CurrentUser() currentUser: CurrentUserDto,
  ): object {
    return this.sessionService.getDoctorNextUpcomingSession(currentUser);
  }

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT)
  @ApiOperation({ summary: 'Get sessions list for patient' })
  @ApiQuery(apiSessionsPage)
  @ApiQuery(apiSessionsLimit)
  @ApiQuery(apiStatusQuery)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiOkResponse(apiSessionsListResponse)
  @Get('patient/all')
  getPatientSessionsList(
    @CurrentUser() currentUser: CurrentUserDto,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: string,
  ): object {
    return this.sessionService.getPatientSessionsList(
      currentUser,
      page || 1,
      limit || 4,
      status,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT)
  @ApiOperation({ summary: 'Update session date and time' })
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiParam(apiSessionIdParam)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiOkResponse(apiSessionsListResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @Patch('patient/session/:sessionId')
  updatePatientSession(
    @Param('sessionId') sessionId: string,
    @Body() body: UpdatedSessionDto,
  ): object {
    return this.sessionService.updatePatientSession(sessionId, body);
  }
}
