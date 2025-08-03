import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import { ScheduleRepository } from './repository/schedule.repository';
import { GetDoctorSchedule, ScheduleDto } from './dto/schedule.dto';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { UserRole } from 'src/enums/users.enums';

@Injectable()
export class ScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async createOrUpdateSchedule(
    @Res() res: Response,
    body: ScheduleDto,
    currentUser: CurrentUserDto,
  ): Promise<any> {
    // Use upsertSchedule to handle both creation and update
    const schedule = await this.scheduleRepository.upsertSchedule(
      currentUser.id,
      body,
    );

    const message = schedule
      ? 'Schedule updated successfully'
      : 'Schedule created successfully';

    return {
      success: true,
      statusCode: schedule ? HttpStatus.OK : HttpStatus.CREATED,
      message,
    };
  }

  async getDoctorSchedule(
    currentUser: CurrentUserDto,
    payload: GetDoctorSchedule,
  ): Promise<any> {
    const doctorSchedules = await this.scheduleRepository.getDoctorSchedules(
      currentUser.role === UserRole.PSYCHOLOGIST
        ? currentUser.id
        : payload.doctorId,
    );

    if (!doctorSchedules.length) {
      throw new HttpException('Schedules not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Schedules fetched successfully',
      data: doctorSchedules,
    };
  }

  async getDoctorAvailableTimes(
    currentUser: CurrentUserDto,
    doctorId: string,
  ): Promise<any> {
    const schedule =
      await this.scheduleRepository.getAvailableTimesForDoctorSchedule(
        doctorId,
      );

    if (!schedule)
      throw new HttpException('Not schedule found.', HttpStatus.NOT_FOUND);

    return {
      success: true,
      statusCode: 200,
      message: 'Schedule fetched successfully',
      data: schedule,
    };
  }
}
