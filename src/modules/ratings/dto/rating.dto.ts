import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { VALIDATION_MESSAGES } from 'src/constants/validation.constants';
import { RatingOptions } from 'src/enums/ratings.enums';

export class RatingDto {
  @ApiProperty()
  @IsNotEmpty({ message: `Doctor ID ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Doctor ID ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly doctorId: string;

  @ApiProperty()
  @IsNotEmpty({ message: `Session ID ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Session ID ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly sessionId: string;

  @ApiProperty({ enum: RatingOptions })
  @IsOptional()
  @IsIn([
    RatingOptions.VERY_BAD,
    RatingOptions.BAD,
    RatingOptions.AVERAGE,
    RatingOptions.GOOD,
    RatingOptions.VERY_GOOD,
  ])
  @Type(() => Number)
  readonly sessionRating?: RatingOptions;

  @ApiProperty({ enum: RatingOptions })
  @IsOptional()
  @IsIn([
    RatingOptions.VERY_BAD,
    RatingOptions.BAD,
    RatingOptions.AVERAGE,
    RatingOptions.GOOD,
    RatingOptions.VERY_GOOD,
  ])
  @Type(() => Number)
  readonly doctorRating?: RatingOptions;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: `Session Comment ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly sessionComment?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: `Doctor Comment ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly doctorComment?: string;
}

export class ListRatingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly size?: number = 4;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly doctorId?: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  readonly sortOrder?: 'asc' | 'desc' = 'desc';
}
