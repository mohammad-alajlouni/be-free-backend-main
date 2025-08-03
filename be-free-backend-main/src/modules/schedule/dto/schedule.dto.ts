import {
  IsNotEmpty,
  ArrayNotEmpty,
  IsEnum,
  ValidateNested,
  IsOptional,
  ArrayUnique,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WeekDays } from 'src/enums/days.enums';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Custom validator for time range
@ValidatorConstraint({ name: 'IsValidTimeRange', async: false })
export class IsValidTimeRangeConstraint
  implements ValidatorConstraintInterface
{
  validate(timeRange: TimeRangeDto): boolean {
    if (!timeRange) {
      return true;
    }

    return new Date(timeRange.from) < new Date(timeRange.to);
  }

  defaultMessage(): string {
    return 'from time must be before to time.';
  }
}

// Custom validation decorator for time range
export function IsValidTimeRange(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidTimeRangeConstraint,
    });
  };
}

export class TimeRangeDto {
  @ApiProperty({
    type: Date,
    description: 'The start time of the time range',
    required: true,
    example: '2024-09-09T00:00:00Z',
  })
  @IsNotEmpty({ message: 'Start time (from) must not be empty.' })
  from: Date;

  @ApiProperty({
    type: Date,
    description: 'The end time of the time range',
    required: true,
    example: '2024-09-09T01:00:00Z',
  })
  @IsNotEmpty({ message: 'End time (to) must not be empty.' })
  to: Date;
}

export function ArrayLength(
  length: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'arrayLength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          return Array.isArray(value) && value.length === length;
        },
        defaultMessage(args: ValidationArguments) {
          return `Array must have exactly ${length} items.`;
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'NoOverlappingTimeRanges', async: false })
export class NoOverlappingTimeRangesConstraint
  implements ValidatorConstraintInterface
{
  validate(timeRanges: TimeRangeDto[]): boolean {
    // Sort the time ranges by the "from" time
    const sortedRanges = timeRanges.sort(
      (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime(),
    );

    for (let i = 0; i < sortedRanges.length - 1; i++) {
      const currentRange = sortedRanges[i];
      const nextRange = sortedRanges[i + 1];

      // Check if current range overlaps with the next range
      if (
        new Date(currentRange.to).getTime() > new Date(nextRange.from).getTime()
      ) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(): string {
    return 'Time ranges within a day must not overlap.';
  }
}

export function NoOverlappingTimeRanges(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoOverlappingTimeRangesConstraint,
    });
  };
}

export class DayScheduleDto {
  @ApiProperty({
    description: 'The day of the week',
    enum: WeekDays,
    required: true,
  })
  @IsEnum(WeekDays, { message: 'Day must be a valid day of the week.' })
  day: WeekDays;

  @ApiProperty({
    type: [TimeRangeDto],
    description: 'Array of time ranges for the day',
    required: true,
    example: [{ from: '2024-09-09T00:00:00Z', to: '2024-09-09T01:00:00Z' }],
  })
  @IsOptional()
  @ArrayNotEmpty({ message: 'Each day must have at least one time range.' })
  @IsValidTimeRange({
    each: true,
    message: 'from time must be before to time.',
  })
  @NoOverlappingTimeRanges({ message: 'Time ranges must not overlap.' })
  @ValidateNested({ each: true })
  @Type(() => TimeRangeDto)
  timeRanges: TimeRangeDto[];
}

export class ScheduleDto {
  @ApiProperty({
    type: [DayScheduleDto],
    description: 'Array of schedules for the week',
    required: true,
    example: [
      {
        day: 'Sunday',
        timeRanges: [
          { from: '2024-09-09T00:00:00Z', to: '2024-09-09T01:00:00Z' },
        ],
      },
      {
        day: 'Monday',
        timeRanges: [
          { from: '2024-09-10T09:00:00Z', to: '2024-09-10T10:00:00Z' },
          { from: '2024-09-10T11:00:00Z', to: '2024-09-10T12:00:00Z' },
        ],
      },
      {
        day: 'Tuesday',
        timeRanges: [
          { from: '2024-09-11T08:00:00Z', to: '2024-09-11T09:00:00Z' },
        ],
      },
      {
        day: 'Wednesday',
        timeRanges: [
          { from: '2024-09-12T14:00:00Z', to: '2024-09-12T15:00:00Z' },
        ],
      },
      {
        day: 'Thursday',
        timeRanges: [
          { from: '2024-09-13T16:00:00Z', to: '2024-09-13T17:00:00Z' },
        ],
      },
      {
        day: 'Friday',
        timeRanges: [
          { from: '2024-09-14T18:00:00Z', to: '2024-09-14T19:00:00Z' },
        ],
      },
      {
        day: 'Saturday',
        timeRanges: [
          { from: '2024-09-15T20:00:00Z', to: '2024-09-15T21:00:00Z' },
        ],
      },
    ],
  })
  @ArrayLength(7)
  @ArrayUnique((daySchedule: DayScheduleDto) => daySchedule.day, {
    message: 'The days array must contain unique days.',
  })
  @ValidateNested({ each: true })
  @Type(() => DayScheduleDto)
  days: DayScheduleDto[];
}

export class GetDoctorSchedule {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly doctorId?: string;
}
