import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MaritalStatus } from 'src/enums/maritalStatus.enums';
import { Transform, Type } from 'class-transformer';
import {
  AwarenessLevel,
  CurrentJobStatus,
  Gender,
  HowCanWeHelpYou,
  WhereDidYouHearAboutUs,
} from 'src/enums/patients.enums';
import { VALIDATION_MESSAGES } from 'src/constants/validation.constants';

export class PatientDto {
  @ApiProperty({
    type: String,
    description: 'Patient full name',
    required: true,
    example: 'Mahmoud Serag Ismail',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    type: String,
    description: 'Patient email',
    required: true,
    example: 'sragmahmoud4@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: Number,
    description: 'Patient gender',
    example: 1,
  })
  @IsEnum(Gender)
  @Type(() => Number)
  gender: Gender;

  @ApiProperty({
    type: Date,
    description: 'Patient birth date',
    required: true,
    example: '2024-09-09T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  profilePicture: any;

  @ApiProperty({
    type: Number,
    description: 'Patient Marital Status',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsEnum(MaritalStatus, {
    message: `Marital Status be 1 for single, 2 for married, 3 for divorced, 4 for widowed`,
  })
  maritalStatus: number;
}

export class CompletePatientDto {
  @ApiProperty({
    type: Number,
    description: 'Patient awareness level',
    example: 1,
  })
  @IsEnum(AwarenessLevel)
  awarenessLevel: AwarenessLevel;

  @ApiProperty({
    type: Number,
    description: 'Patient gender',
    example: 1,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    type: Number,
    description: 'Patient Marital Status',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsEnum(MaritalStatus, {
    message: `Marital Status be 1 for single, 2 for married, 3 for divorced, 4 for widowed`,
  })
  maritalStatus: number;

  @ApiProperty({
    type: Number,
    description: 'Patient current job status',
    example: 1,
  })
  @IsEnum(CurrentJobStatus)
  currentJobStatus: CurrentJobStatus;

  @ApiProperty({
    type: Date,
    description: 'Patient birth date',
    required: true,
    example: '2024-09-09T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;

  @ApiProperty({
    type: Number,
    description: 'How we can help the patient',
    example: 1,
  })
  @IsEnum(HowCanWeHelpYou)
  howCanWeHelpYou: HowCanWeHelpYou;

  @ApiProperty({
    type: Number,
    description: 'Where did the patient hear about us',
    example: 1,
  })
  @IsEnum(WhereDidYouHearAboutUs)
  whereDidYouHearAboutUs: WhereDidYouHearAboutUs;

  @ApiProperty()
  @IsNotEmpty({ message: `Full name ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `Full name ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly fullName: string;


  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  readonly email: string;
}
