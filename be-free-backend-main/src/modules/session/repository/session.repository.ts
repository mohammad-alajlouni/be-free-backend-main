import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';

import { SessionInterface } from '../interface/session.interface';
import { SessionDto } from '../dto/session.dto';

import * as moment from 'moment';
import { ChatRepository } from 'src/modules/chat/repository/chat.repository';
import { UpdatedSessionDto } from '../dto/updateSession.dto';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel('Session')
    private readonly sessionModel: Model<SessionInterface>,
    private readonly chatRepository: ChatRepository,
  ) {}

  async createNewSession(session: SessionDto): Promise<void> {
    await this.sessionModel.create({
      ...session,
      _id: new mongoose.Types.ObjectId().toString(),
      dayId: session.dayId.toString(),
      timeRangeId: session.timeRangeId.toString(),
    });
  }

  async getSingleSession(sessionId: string): Promise<SessionInterface> {
    return await this.sessionModel.findById(sessionId).lean();
  }

  async getSessionById(sessionId: string): Promise<any> {
    let isDayExist = false;
    const dayDetails = {};

    const session = await this.sessionModel
      .findById(sessionId)
      .select('-__v -createdAt -updatedAt')
      .populate({
        path: 'doctorId',
        select:
          'name _id fullName mobile email languages country city degree university',
      })
      .populate({
        path: 'scheduleId',
        select: 'days timeRanges',
      })
      .lean();

    if (session) {
      const dayId = session.dayId;
      for (let i = 0; i < session.scheduleId['days'].length; i++) {
        const scheduleDay = session.scheduleId['days'][i];
        if (scheduleDay['_id'] === dayId) {
          isDayExist = true;
          dayDetails['_id'] = scheduleDay['_id'] || null;
          dayDetails['day'] = scheduleDay['day'] || null;
          dayDetails['timeRanges'] = scheduleDay['timeRanges'] || null;
        }
      }

      if (isDayExist) session.scheduleId = dayDetails;

      const { doctorId, patientId } = session;
      const room = await this.chatRepository.getRoomByDoctorIdAndPatientId(
        doctorId,
        patientId,
      );

      return {
        _id: session._id,
        doctorData: session.doctorId,
        patientId: session.patientId,
        scheduleData: session.scheduleId,
        numberOfSessions: session.numberOfSessions,
        duration: session.duration,
        sessionType: session.sessionType,
        notes: session.notes,
        isPending: session.isPending,
        isRejected: session.isRejected,
        status: session.status,
        roomId: room ? room._id : null,
      };
    }

    return null;
  }

  async cancelSessionById(sessionId: string): Promise<void> {
    await this.sessionModel.findByIdAndUpdate(sessionId, {
      isPending: false,
      status: 'Canceled',
    });
  }

  async completeSession(sessionId: string): Promise<void> {
    await this.sessionModel.findByIdAndUpdate(sessionId, {
      isPending: false,
      status: 'Completed',
    });
  }

  async updateSessionStatusById(sessionId: string): Promise<void> {
    await this.sessionModel.findByIdAndUpdate(sessionId, {
      status: 'Current',
    });
  }

  async getSessionsListForDoctor(
    doctorId: string,
    searchQuery: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const query = {
      doctorId,
      ...(searchQuery ? { status: searchQuery } : {}),
    };

    const sessions = await this.sessionModel
      .find(query)
      .select('-__v -createdAt -updatedAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'doctorId',
        select:
          '_id fullName mobile email languages country city degree university',
      })
      .populate({
        path: 'patientId',
        select: '_id fullName profilePicture',
      })
      .populate({
        path: 'scheduleId',
        select: 'days timeRanges',
      })
      .lean();

    const finalSessions = sessions.map((session) => {
      const scheduleDay = session.scheduleId?.days.find(
        (day) => day._id === session.dayId,
      );

      const dayDetails = scheduleDay
        ? {
            _id: scheduleDay._id || null,
            day: scheduleDay.day || null,
            timeRanges: scheduleDay.timeRanges || null,
          }
        : {};

      return {
        _id: session._id,
        doctorData: session.doctorId,
        patientData: session.patientId,
        scheduleData: dayDetails,
        numberOfSessions: session.numberOfSessions,
        duration: session.duration,
        sessionType: session.sessionType,
        notes: session.notes,
        isPending: session.isPending,
        isRejected: session.isRejected,
        status: session.status,
      };
    });

    return finalSessions;
  }

  async getNextUpcomingSessionForDoctor(doctorId: string): Promise<any> {
    const now = new Date();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          doctorId,
          status: { $in: 'Current' },
          date: { $gte: now },
        },
      },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patientDetails',
        },
      },
      {
        $unwind: {
          path: '$patientDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'schedules',
          localField: 'dayId',
          foreignField: 'days._id',
          pipeline: [
            { $unwind: '$days' },
            { $match: { 'days._id': { $exists: true } } },
            {
              $project: {
                _id: '$days._id',
                day: '$days.day',
              },
            },
          ],
          as: 'dayDetails',
        },
      },
      {
        $unwind: {
          path: '$dayDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'schedules',
          localField: 'timeRangeId',
          foreignField: 'days.timeRanges._id',
          pipeline: [
            { $unwind: '$days' },
            { $unwind: '$days.timeRanges' },
            { $match: { 'days.timeRanges._id': { $exists: true } } },
            {
              $project: {
                _id: '$days.timeRanges._id',
                from: '$days.timeRanges.from',
                to: '$days.timeRanges.to',
              },
            },
          ],
          as: 'timeRangeDetails',
        },
      },
      {
        $unwind: {
          path: '$timeRangeDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          patientDetails: {
            _id: 1,
            fullName: 1,
            profilePicture: 1,
          },
          dayDetails: {
            _id: 1,
            day: 1,
          },
          timeRangeDetails: {
            _id: 1,
            from: 1,
            to: 1,
          },
          numberOfSessions: 1,
          duration: 1,
          sessionType: 1,
          notes: 1,
          isPending: 1,
          isRejected: 1,
          status: 1,
          date: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $limit: 1,
      },
    ];

    const [session] = await this.sessionModel.aggregate(pipeline);

    return session || null;
  }

  async getSessionsListForPatient(
    patientId: string,
    page: number,
    limit: number,
    status: string,
  ): Promise<any> {
    const sessions = await this.sessionModel
      .find({ patientId, status })
      .select('-__v -createdAt -updatedAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'doctorId',
        select:
          'name _id fullName profilePicture specialities mobile email languages country city degree university',
      })
      .populate({
        path: 'scheduleId',
        select: 'days timeRanges',
      })
      .lean();

    const finalSessions = sessions.map((session) => {
      const scheduleDay = session.scheduleId?.days.find(
        (day) => day._id.toString() === session.dayId.toString(),
      );

      const dayDetails = scheduleDay
        ? {
            _id: scheduleDay._id || null,
            day: scheduleDay.day || null,
            timeRanges: scheduleDay.timeRanges || null,
          }
        : {};

      return {
        _id: session._id,
        doctorData: session.doctorId,
        patientId: session.patientId,
        scheduleData: dayDetails,
        numberOfSessions: session.numberOfSessions,
        duration: session.duration,
        sessionType: session.sessionType,
        notes: session.notes,
        isPending: session.isPending,
        isRejected: session.isRejected,
        status: session.status,
      };
    });

    return finalSessions;
  }

  async getCurrentSessionsForDoctor(doctorId: string): Promise<number> {
    return await this.sessionModel
      .countDocuments({ status: 'Current', doctorId })
      .lean();
  }

  async getCompletedSessionsForDoctor(doctorId: string): Promise<number> {
    return await this.sessionModel
      .countDocuments({ status: 'Completed', doctorId })
      .lean();
  }

  async getCanceledSessionsForDoctor(doctorId: string): Promise<number> {
    return await this.sessionModel
      .countDocuments({ status: 'Canceled', doctorId })
      .lean();
  }

  async getAcceptedSessionsForDoctor(doctorId: string): Promise<number> {
    return await this.sessionModel
      .countDocuments({ isPending: false, isRejected: false, doctorId })
      .lean();
  }

  async getRejectedSessionsForDoctor(doctorId: string): Promise<number> {
    return await this.sessionModel
      .countDocuments({ isRejected: true, isPending: false, doctorId })
      .lean();
  }

  async getDoctorWeeklySessionCount(doctorId: string): Promise<any> {
    const today = moment().endOf('day').toDate();
    const sevenDaysAgo = moment().subtract(6, 'days').startOf('day').toDate();

    const dateArray = [];
    for (let i = 0; i < 7; i++) {
      dateArray.push(
        moment().subtract(i, 'days').endOf('day').format('YYYY-MM-DD'),
      );
    }

    const sessions = await this.sessionModel.aggregate([
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
          sessionsCount: { $sum: 1 },
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
          sessionsCount: 1,
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
        sessionsCount: 0,
        day: dayName,
        date: dateString,
      };
    });

    sessions.forEach((session) => {
      const index = result.findIndex((r) => r.date === session.date);
      if (index !== -1) result[index].sessionsCount = session.sessionsCount;
    });

    return result;
  }

  async updateSessionById(
    sessionId: string,
    body: UpdatedSessionDto,
  ): Promise<void> {
    return await this.sessionModel.findByIdAndUpdate(sessionId, body);
  }

  async isSessionBookedBetweenDoctorAndPatient(
    doctorId: string,
    patientId: string,
  ): Promise<any> {
    const session = await this.sessionModel
      .findOne({
        doctorId,
        patientId,
        status: { $ne: 'Canceled' },
      })
      .lean();

    return session;
  }
}
