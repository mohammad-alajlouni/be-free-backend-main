import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ScheduleInterface } from '../interface/schedule.interface';
import { ScheduleDto } from '../dto/schedule.dto';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectModel('Schedule')
    private readonly scheduleModel: Model<ScheduleInterface>,
  ) {}

  async upsertSchedule(
    doctorId: string,
    scheduleDto: ScheduleDto,
  ): Promise<ScheduleInterface | null> {
    // Check if the doctor already has a schedule
    const existingSchedule = await this.scheduleModel.findOne({ doctorId });

    if (existingSchedule) {
      // Prepare the updated days array
      const updatedDays = scheduleDto.days.map((newDay) => {
        const existingDay = existingSchedule.days.find(
          (day) => day.day === newDay.day,
        );

        return {
          ...newDay,
          _id: existingDay?._id || new Types.ObjectId().toString(),
          timeRanges: newDay.timeRanges.map((newRange) => {
            const existingRange = existingDay?.timeRanges?.find(
              (range) =>
                range.from === newRange.from && range.to === newRange.to,
            );

            return {
              ...newRange,
              _id: existingRange?._id || new Types.ObjectId().toString(),
            };
          }),
        };
      });

      // Use $set to ensure full replacement of the nested days field
      return await this.scheduleModel
        .findOneAndUpdate(
          { doctorId },
          { $set: { days: updatedDays } },
          { new: true },
        )
        .lean();
    } else {
      // If schedule doesn't exist, create a new one
      const scheduleWithDoctorId = {
        doctorId,
        ...scheduleDto,
        _id: new Types.ObjectId().toString(),
        days: scheduleDto.days.map((day) => ({
          ...day,
          _id: new Types.ObjectId().toString(),
          timeRanges: day.timeRanges.map((range) => ({
            ...range,
            _id: new Types.ObjectId().toString(),
          })),
        })),
      };

      const createdSchedule = new this.scheduleModel(scheduleWithDoctorId);
      return await createdSchedule.save();
    }
  }

  async getScheduleByDoctorId(
    doctorId: string,
  ): Promise<ScheduleInterface | null> {
    return await this.scheduleModel.findOne({ doctorId }).lean();
  }

  async getDoctorSchedules(doctorId: string): Promise<ScheduleInterface[]> {
    return await this.scheduleModel.find({ doctorId }).lean();
  }

  async getAvailableTimesForDoctorSchedule(
    doctorId: string,
  ): Promise<Partial<ScheduleInterface>> {
    const doctorSchedule = await this.scheduleModel.aggregate([
      { $match: { doctorId } },
      {
        $project: {
          doctorId: 1,
          days: {
            $filter: {
              input: '$days',
              as: 'day',
              cond: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$$day.timeRanges',
                        as: 'timeRange',
                        cond: { $eq: ['$$timeRange.isAvailable', true] },
                      },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          doctorId: 1,
          days: {
            $map: {
              input: '$days',
              as: 'day',
              in: {
                _id: '$$day._id',
                day: '$$day.day',
                availableTimeRanges: {
                  $filter: {
                    input: '$$day.timeRanges',
                    as: 'timeRange',
                    cond: { $eq: ['$$timeRange.isAvailable', true] },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    return doctorSchedule[0] || null;
  }

  async updateTimeRangeAvailability(
    scheduleId: string,
    dayId: string,
    timeRangeId: string,
    isAvailable: boolean,
  ) {
    return await this.scheduleModel.updateOne(
      {
        _id: scheduleId,
        'days._id': dayId,
        'days.timeRanges._id': timeRangeId,
      },
      {
        $set: {
          'days.$[day].timeRanges.$[timeRange].isAvailable': isAvailable,
        },
      },
      {
        arrayFilters: [{ 'day._id': dayId }, { 'timeRange._id': timeRangeId }],
      },
    );
  }
}
