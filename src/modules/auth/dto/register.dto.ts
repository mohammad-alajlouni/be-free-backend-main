import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/constants/validation.constants';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty({ message: `Full name ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Full name ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly fullName: string;

  @ApiProperty()
  @IsMobilePhone()
  @Transform(({ value }) => value.trim())
  readonly mobile: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  readonly email: string;

  @ApiProperty({
    type: Number,
    description: 'Doctor gender',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsEnum([1, 2], {
    message: `Gender be 1 for male or 2 for female`,
  })
  gender: number;

  @ApiProperty()
  @IsNotEmpty({ message: `Birthdate ${VALIDATION_MESSAGES.emptyField}` })
  @Transform(({ value }) => new Date(value))
  readonly birthdate: Date;

  @ApiProperty()
  @IsString({
    each: true,
    message: `Language ${VALIDATION_MESSAGES.stringField}`,
  })
  readonly languages: string[];

  @ApiProperty({ type: 'string', format: 'binary' })
  profilePicture: any;

  @ApiProperty()
  @IsNotEmpty({ message: `Country ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Country ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly country: string;

  @ApiProperty()
  @IsNotEmpty({ message: `City ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `City ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly city: string;

  @ApiProperty()
  @IsNotEmpty({ message: `Degree ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Degree ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly degree: string;

  @ApiProperty()
  @IsNotEmpty({ message: `University ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `University ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly university: string;

  @ApiProperty()
  @IsNotEmpty({ message: `Graduation year ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Graduation year ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly graduationYear: string;

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
  @IsNotEmpty({
    message: `Classification ${VALIDATION_MESSAGES.emptyField}`,
  })
  @IsString({
    message: `Classification ${VALIDATION_MESSAGES.stringField}`,
  })
  @Transform(({ value }) => value.trim())
  readonly classification: string;

  @ApiProperty()
  @IsNotEmpty({
    message: `Classification expiry ${VALIDATION_MESSAGES.emptyField}`,
  })
  @Transform(({ value }) => new Date(value))
  readonly classificationExpiry: Date;

  @ApiProperty()
  @IsNotEmpty({
    message: `Consultation type ${VALIDATION_MESSAGES.emptyField}`,
  })
  @IsString({
    message: `Consultation type ${VALIDATION_MESSAGES.stringField}`,
  })
  @Transform(({ value }) => value.trim())
  readonly consultationType: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  cv: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  classificationFile: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  lastDegree: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  nationalId: any;
}
