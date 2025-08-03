import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { RolesGuard } from '../auth/roles-auth.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/users.enums';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  apiForbiddenResponse,
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
  apiUnauthorizedResponse,
} from 'src/swagger/error.swagger';
import { ApiDoctorStatisticsResponse } from 'src/swagger/statistics/statistics.swagger';

@ApiProduces('application/json')
@ApiTags('Statistics')
@UseGuards(RolesGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiOkResponse({
    description: 'Consolidated doctor statistics fetched successfully',
    type: ApiDoctorStatisticsResponse,
  })
  @Roles(UserRole.PSYCHOLOGIST)
  @ApiOperation({ summary: 'Get consolidated statistics for doctor' })
  async getConsolidatedDoctorStatistics(
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    const doctorId = currentUser.id;

    // Fetch all statistics concurrently
    const [appointmentStats, revenueStats, sessionCount, visitorCount] =
      await Promise.all([
        this.statisticsService.getStatisticsForDoctorAppointments(doctorId),
        this.statisticsService.getDoctorRevenue(),
        this.statisticsService.getDoctorWeeklySessionCount(doctorId),
        this.statisticsService.getDoctorWeeklyVisitorsCount(doctorId),
      ]);

    return {
      success: true,
      statusCode: 200,
      message: 'Consolidated doctor statistics fetched successfully',
      data: {
        appointments: appointmentStats.data,
        revenue: revenueStats.data,
        weeklySessions: sessionCount.weeklySessionsCount,
        weeklyVisitors: visitorCount.weeklyVisitorsCount,
      },
    };
  }

  @Get('/summary')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiOkResponse({
    description: 'Doctor summary statistics fetched successfully',
  })
  @Roles(UserRole.PSYCHOLOGIST)
  @ApiOperation({ summary: 'Get doctor summary statistics' })
  async getDoctorSummaryStats(@CurrentUser() currentUser: CurrentUserDto) {
    const doctorId = currentUser.id;

    const summaryStats =
      await this.statisticsService.getDoctorSummaryStats(doctorId);

    return {
      success: true,
      statusCode: 200,
      message: 'Doctor summary statistics fetched successfully',
      data: summaryStats.data,
    };
  }
}
