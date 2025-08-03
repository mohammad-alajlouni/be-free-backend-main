import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { VALIDATION_MESSAGES } from 'src/constants/validation.constants';

export class CourseDto {
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
  @IsNotEmpty({ message: `Images ${VALIDATION_MESSAGES.emptyField}` })
  @IsArray({ message: 'Images must be an array of strings' })
  @Transform(({ value }) => value.trim())
  readonly images: string[];

  @ApiProperty()
  @IsNotEmpty({ message: `Videos ${VALIDATION_MESSAGES.emptyField}` })
  @IsArray({ message: 'Videos must be an array of strings' })
  @Transform(({ value }) => value.trim())
  readonly videos: string[];
}

export class ListCoursesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly search?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly size?: number = 4;
}
