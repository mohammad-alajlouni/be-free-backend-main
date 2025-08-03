import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { NumberOfSessions, SessionDuration } from 'src/enums/sessions.enums';

export class SessionDto {
  @ApiProperty({
    type: String,
    example: '64d97510859dc4f83d9dc0c8',
    description: 'Should provide doctor id to fetch schedule day details',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'Invalid day id' })
  dayId: string;

  @ApiProperty({
    type: String,
    example: '64d97510859dc4f83d9dc0c8',
    description: 'Should provide doctor id to fetch time range details',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'Invalid time range id' })
  timeRangeId: string;

  @ApiProperty({
    type: Number,
    example: NumberOfSessions.ONE,
    description: 'Number of sessions',
    required: true,
    enum: NumberOfSessions,
    enumName: 'NumberOfSessions',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfSessions: number;

  @ApiProperty({
    type: Number,
    example: SessionDuration.THIRTY_MINUTES,
    description: 'Duration of session',
    required: true,
    enum: SessionDuration,
    enumName: 'SessionDuration',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(30)
  duration: SessionDuration;

  @ApiProperty({
    type: Date,
    example: '2024-11-01',
    description: 'Date of session',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
