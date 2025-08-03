import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { VALIDATION_MESSAGES } from 'src/constants/validation.constants';

export class MeetingDto {
  @ApiProperty()
  @IsNotEmpty({ message: `Doctor ID ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Doctor ID ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly doctorId: string;

  @ApiProperty()
  @IsNotEmpty({ message: `Title ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Title ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty({ message: `Description ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Description ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty({ message: `Goals ${VALIDATION_MESSAGES.emptyField}` })
  @IsArray({ message: 'Goals must be an array of strings' })
  @Transform(({ value }) => value.trim())
  readonly goals: string[];

  @ApiProperty()
  @IsNotEmpty({ message: `Thumbnail ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Thumbnail ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly thumbnail: string;

  @ApiProperty()
  @IsNotEmpty({ message: `Video ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Video ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly video: string;
}

export class ListMeetingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly search?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly size?: number = 4;

  @ApiProperty({
    required: false,
    description: 'Filter meetings by recorded status',
  })
  @IsOptional()
  readonly isRecorded?: boolean;
}
