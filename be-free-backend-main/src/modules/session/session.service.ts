import { ChatService } from './../chat/chat.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { SessionRepository } from './repository/session.repository';
import { ScheduleRepository } from '../schedule/repository/schedule.repository';

import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { SessionDto } from './dto/session.dto';
import { UpdatedSessionDto } from './dto/updateSession.dto';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly chatService: ChatService,
  ) {}

  async createNewSession(
    currentUser: CurrentUserDto,
    doctorId: string,
    body: SessionDto,
  ): Promise<any> {
    const schedule =
      await this.scheduleRepository.getScheduleByDoctorId(doctorId);

    if (!schedule)
      throw new HttpException('Schedule not found', HttpStatus.NOT_FOUND);

    let duration = 0;
    let isDayExist = false;
    let isTimeRangeExist = false;

    for (let i = 0; i < schedule.days.length; i++) {
      const scheduleDay = schedule.days[i];
      if (scheduleDay._id === body.dayId) {
        isDayExist = true;
        for (let j = 0; j < scheduleDay.timeRanges.length; j++) {
          const scheduleTimeRange = scheduleDay.timeRanges[j];
          if (scheduleTimeRange._id === body.timeRangeId) {
            isTimeRangeExist = true;
            if (!scheduleTimeRange.isAvailable) {
              throw new HttpException(
                'Time range already taken',
                HttpStatus.FORBIDDEN,
              );
            }
            const fromDate: Date = scheduleTimeRange.from;
            const toDate: Date = scheduleTimeRange.to;
            if (fromDate.getTime() > toDate.getTime())
              duration = fromDate.getTime() - toDate.getTime();
            else duration = toDate.getTime() - fromDate.getTime();

            break;
          }
        }
      }
    }

    if (!isDayExist)
      throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

    if (!isTimeRangeExist)
      throw new HttpException('Time range not found', HttpStatus.NOT_FOUND);

    const session = {
      scheduleId: schedule._id,
      doctorId,
      patientId: currentUser.id,
      ...body,
      duration,
    };

    await this.sessionRepository.createNewSession(session);

    await this.scheduleRepository.updateTimeRangeAvailability(
      schedule._id,
      body.dayId,
      body.timeRangeId,
      false,
    );

    await this.chatService.createRoom(currentUser.id, doctorId);

    return {
      success: true,
      statusCode: 201,
      message: 'Session created successfully',
    };
  }

  async cancelSession(
    currentUser: CurrentUserDto,
    sessionId: string,
  ): Promise<any> {
    const session = await this.sessionRepository.getSingleSession(sessionId);

    if (!session)
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);

    if (session.patientId !== currentUser.id)
      throw new HttpException(
        'You are not authorized to cancel this session',
        HttpStatus.FORBIDDEN,
      );

    await this.sessionRepository.cancelSessionById(sessionId);

    await this.scheduleRepository.updateTimeRangeAvailability(
      session.scheduleId,
      session.dayId,
      session.timeRangeId,
      true,
    );

    const { patientId, doctorId } = session;
    await this.chatService.deleteRoom(patientId, doctorId);

    return {
      success: true,
      statusCode: 200,
      message: 'Session canceled successfully',
    };
  }

  async completeSession(sessionId: string): Promise<any> {
    const session = await this.sessionRepository.getSingleSession(sessionId);

    if (!session)
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);

    if (session.status !== 'Current') {
      throw new HttpException(
        `Session is not in current status (Current) and cannot be completed. Session status ${session.status}`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.sessionRepository.completeSession(sessionId);

    await this.scheduleRepository.updateTimeRangeAvailability(
      session.scheduleId,
      session.dayId,
      session.timeRangeId,
      true,
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Session completed successfully',
    };
  }

  async getOneSession(
    currentUser: CurrentUserDto,
    sessionId: string,
  ): Promise<any> {
    const session = await this.sessionRepository.getSessionById(sessionId);

    if (!session)
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);

    if (currentUser.role === 1 && session.doctorData._id !== currentUser.id)
      throw new HttpException(
        'You are not authorized to view this session',
        HttpStatus.FORBIDDEN,
      );

    if (currentUser.role !== 1 && session.patientId !== currentUser.id)
      throw new HttpException(
        'You are not authorized to view this session',
        HttpStatus.FORBIDDEN,
      );

    const { patientId, doctorId } = session;
    const room = await this.chatService.getRoomByDoctorIdAndPatientId(
      patientId,
      doctorId,
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Session fetched successfully',
      data: session,
      roomId: room._id,
    };
  }

  async getDoctorSessionsList(
    currentUser: CurrentUserDto,
    searchQuery: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const userId = currentUser.id;
    const sessions = await this.sessionRepository.getSessionsListForDoctor(
      userId,
      searchQuery,
      page,
      limit,
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Sessions fetched successfully',
      data: sessions,
    };
  }

  async getDoctorNextUpcomingSession(
    currentUser: CurrentUserDto,
  ): Promise<any> {
    const userId = currentUser.id;
    const session =
      await this.sessionRepository.getNextUpcomingSessionForDoctor(userId);

    if (!session)
      throw new HttpException(
        'No upcoming sessions found',
        HttpStatus.NOT_FOUND,
      );

    return {
      success: true,
      statusCode: 200,
      message: 'Next upcoming session fetched successfully',
      data: session,
    };
  }

  async getPatientSessionsList(
    currentUser: CurrentUserDto,
    page: number,
    limit: number,
    status: string,
  ): Promise<any> {
    const userId = currentUser.id;

    const sessions = await this.sessionRepository.getSessionsListForPatient(
      userId,
      page,
      limit,
      status,
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Sessions fetched successfully',
      data: sessions,
    };
  }

  async checkIfSessionExistsAndCompleted(sessionId: string): Promise<any> {
    const session = await this.sessionRepository.getSessionById(sessionId);

    if (!session)
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);

    if (session.status !== 'Completed')
      throw new HttpException(
        `Session is not completed yet. Session status: ${session.status}`,
        HttpStatus.FORBIDDEN,
      );

    return {
      success: true,
      statusCode: 200,
      message: 'Session found',
      data: session,
    };
  }

  async updatePatientSession(
    sessionId: string,
    body: UpdatedSessionDto,
  ): Promise<any> {
    const session = await this.sessionRepository.getSessionById(sessionId);

    if (!session)
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);

    if (session.status === 'Completed')
      throw new HttpException(
        `Session is already completed . Session status: ${session.status}`,
        HttpStatus.FORBIDDEN,
      );

    const schedule = await this.scheduleRepository.getScheduleByDoctorId(
      session.doctorId,
    );

    if (!schedule)
      throw new HttpException('Schedule not found', HttpStatus.NOT_FOUND);

    let duration = 0;
    let isDayExist = false;
    let isTimeRangeExist = false;

    for (let i = 0; i < schedule.days.length; i++) {
      const scheduleDay = schedule.days[i];
      if (scheduleDay._id === body.dayId) {
        isDayExist = true;
        for (let j = 0; j < scheduleDay.timeRanges.length; j++) {
          const scheduleTimeRange = scheduleDay.timeRanges[j];
          if (scheduleTimeRange._id === body.timeRangeId) {
            isTimeRangeExist = true;
            if (!scheduleTimeRange.isAvailable) {
              throw new HttpException(
                'Time range already taken',
                HttpStatus.FORBIDDEN,
              );
            }
            const fromDate: Date = scheduleTimeRange.from;
            const toDate: Date = scheduleTimeRange.to;
            if (fromDate.getTime() > toDate.getTime())
              duration = fromDate.getTime() - toDate.getTime();
            else duration = toDate.getTime() - fromDate.getTime();

            break;
          }
        }
      }
    }

    if (!isDayExist)
      throw new HttpException('Day not found', HttpStatus.NOT_FOUND);

    if (!isTimeRangeExist)
      throw new HttpException('Time range not found', HttpStatus.NOT_FOUND);

    const updatedSession = { ...body, duration };

    await this.sessionRepository.updateSessionById(sessionId, updatedSession);

    await this.scheduleRepository.updateTimeRangeAvailability(
      schedule._id,
      body.dayId,
      body.timeRangeId,
      false,
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Session found',
      data: session,
    };
  }

  async validateSession(patientId: string, doctorId: string): Promise<boolean> {
    const session =
      await this.sessionRepository.isSessionBookedBetweenDoctorAndPatient(
        doctorId,
        patientId,
      );

    if (!session) {
      return false;
    }

    if (session.patientId === patientId && session.doctorId === doctorId) {
      return true;
    }

    return false;
  }
}
