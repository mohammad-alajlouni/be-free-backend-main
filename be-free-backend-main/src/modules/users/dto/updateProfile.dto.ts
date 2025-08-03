import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/constants/validation.constants';

export class UpdateProfileDto {
  @ApiProperty()
  @IsNotEmpty({ message: `Full name ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Full name ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly fullName: string;

  @ApiProperty()
  @IsNotEmpty({ message: `Session Price ${VALIDATION_MESSAGES.emptyField}` })
  @Type(() => Number)
  readonly sessionPrice: number;

  @ApiProperty()
  @IsNotEmpty({ message: `Specialization ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Specialization ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly specialization: string;

  @ApiProperty()
  @IsNotEmpty({
    message: `Years of experience ${VALIDATION_MESSAGES.emptyField}`,
  })
  @IsString({
    message: `Years of experience ${VALIDATION_MESSAGES.stringField}`,
  })
  @Transform(({ value }) => value.trim())
  readonly yearsOfExperience: string;

  @ApiProperty()
  @IsNotEmpty({ message: `Bio ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Bio ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly bio: string;

  @ApiProperty()
  @IsString({
    each: true,
    message: `Language ${VALIDATION_MESSAGES.stringField}`,
  })
  readonly languages: string[];

  @ApiProperty()
  @IsString({
    each: true,
    message: `SessionType ${VALIDATION_MESSAGES.stringField}`,
  })
  readonly sessionTypes: string[];

  @ApiProperty()
  @IsString({
    each: true,
    message: `Specialities ${VALIDATION_MESSAGES.stringField}`,
  })
  readonly specialities: string[];
}
