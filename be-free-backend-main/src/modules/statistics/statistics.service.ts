import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { StatisticsRepository } from './repository/statistics.repository';

@Injectable()
export class StatisticsService {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  async getStatisticsForDoctorAppointments(doctorId: string): Promise<any> {
    const {
      currentSessions,
      completedSessions,
      canceledSessions,
      acceptedSessions,
      rejectedSessions,
    } =
      await this.statisticsRepository.getStatisticsForDoctorAppointments(
        doctorId,
      );

    if (
      !currentSessions &&
      !completedSessions &&
      !canceledSessions &&
      !acceptedSessions &&
      !rejectedSessions
    )
      throw new HttpException('Statistics not found', HttpStatus.NOT_FOUND);

    return {
      success: true,
      statusCode: 200,
      message: 'Statistics fetched successfully',
      data: {
        currentSessions: currentSessions,
        completedSessions: completedSessions,
        canceledSessions: canceledSessions,
        acceptedSessions: acceptedSessions,
        rejectedSessions: rejectedSessions,
      },
    };
  }

  async getDoctorRevenue(): Promise<any> {
    const doctorRevenue = await this.statisticsRepository.getDoctorRevenue();

    return {
      success: true,
      statusCode: 200,
      message: 'Revenue fetched',
      data: doctorRevenue,
    };
  }

  async getDoctorWeeklySessionCount(doctorId: string): Promise<any> {
    const weeklySessionsCount =
      await this.statisticsRepository.getDoctorWeeklySessionCount(doctorId);

    if (!weeklySessionsCount.length)
      throw new HttpException('No sessions found.', 404);

    return {
      success: true,
      statusCode: 200,
      message: 'Sessions count fetched successfully',
      weeklySessionsCount,
    };
  }

  async getDoctorWeeklyVisitorsCount(doctorId: string): Promise<any> {
    const weeklyVisitorsCount =
      await this.statisticsRepository.getDoctorWeeklyVisitorsCount(doctorId);

    if (!weeklyVisitorsCount.length)
      throw new HttpException('No visitors found.', 404);

    return {
      success: true,
      statusCode: 200,
      message: 'Visitors count fetched successfully',
      weeklyVisitorsCount,
    };
  }

  async getDoctorSummaryStats(doctorId: string): Promise<any> {
    const statsData =
      await this.statisticsRepository.getStatisticsForDoctorAppointments(
        doctorId,
      );

    const totalSessions =
      statsData.completedSessions +
      statsData.canceledSessions +
      statsData.currentSessions;
    const staticProfit = 120; // Static profit value

    return {
      success: true,
      statusCode: 200,
      message: 'Doctor summary stats fetched successfully',
      data: {
        totalSessions,
        completedSessions: statsData.completedSessions,
        canceledSessions: statsData.canceledSessions,
        profit: staticProfit,
      },
    };
  }
}
