import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SessionRepository } from 'src/modules/session/repository/session.repository';
import { Model } from 'mongoose';
import { UserCountSchema } from '../../users/schemas/UserCount.schema';
import * as moment from 'moment';

@Injectable()
export class StatisticsRepository {
  constructor(
    @InjectModel('UserCountSchema')
    private readonly userCountModel: Model<typeof UserCountSchema>,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async getStatisticsForDoctorAppointments(doctorId: string): Promise<any> {
    const [
      currentSessions,
      completedSessions,
      canceledSessions,
      acceptedSessions,
      rejectedSessions,
    ] = await Promise.all([
      await this.sessionRepository.getCurrentSessionsForDoctor(doctorId),
      await this.sessionRepository.getCompletedSessionsForDoctor(doctorId),
      await this.sessionRepository.getCanceledSessionsForDoctor(doctorId),
      await this.sessionRepository.getAcceptedSessionsForDoctor(doctorId),
      await this.sessionRepository.getRejectedSessionsForDoctor(doctorId),
    ]);

    return {
      currentSessions,
      completedSessions,
      canceledSessions,
      acceptedSessions,
      rejectedSessions,
    };
  }

  async getDoctorRevenue(): Promise<any> {
    return [
      { day: 'Saturday', revenue: 2000 },
      { day: 'Sunday', revenue: 1000 },
      { day: 'Monday', revenue: 3000 },
      { day: 'Tuesday', revenue: 4000 },
      { day: 'Wednesday', revenue: 5000 },
      { day: 'Thursday', revenue: 6000 },
      { day: 'Friday', revenue: 7000 },
    ];
  }

  async getDoctorWeeklySessionCount(
    doctorId: string,
  ): Promise<[{ date: string; day: string; count: number }]> {
    return await this.sessionRepository.getDoctorWeeklySessionCount(doctorId);
  }

  async getDoctorWeeklyVisitorsCount(doctorId: string): Promise<any> {
    const today = moment().endOf('day').toDate();
    const sevenDaysAgo = moment().subtract(6, 'days').startOf('day').toDate();

    const dateArray = [];
    for (let i = 0; i < 7; i++) {
      dateArray.push(
        moment().subtract(i, 'days').endOf('day').format('YYYY-MM-DD'),
      );
    }

    const visitors = await this.userCountModel.aggregate([
      {
        $match: {
          doctorId,
          createdAt: {
            $gte: sevenDaysAgo,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          visitorsCount: { $sum: 1 },
          createdAt: { $first: '$createdAt' },
        },
      },
      {
        $project: {
          _id: 0,
          day: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 1] }, then: 'Sunday' },
                { case: { $eq: ['$_id', 2] }, then: 'Monday' },
                { case: { $eq: ['$_id', 3] }, then: 'Tuesday' },
                { case: { $eq: ['$_id', 4] }, then: 'Wednesday' },
                { case: { $eq: ['$_id', 5] }, then: 'Thursday' },
                { case: { $eq: ['$_id', 6] }, then: 'Friday' },
                { case: { $eq: ['$_id', 7] }, then: 'Saturday' },
              ],
              default: 'Unknown',
            },
          },
          visitorsCount: 1,
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const result = dateArray.map((dateString) => {
      const dayName = moment(dateString).format('dddd');
      return {
        visitorsCount: 0,
        day: dayName,
        date: dateString,
      };
    });

    visitors.forEach((visitor) => {
      const index = result.findIndex((r) => r.date === visitor.date);
      if (index !== -1) result[index].visitorsCount = visitor.visitorsCount;
    });

    return result;
  }
}
