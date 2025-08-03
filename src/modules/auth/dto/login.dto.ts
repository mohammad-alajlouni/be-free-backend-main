import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/constants/validation.constants';
import { UserRole } from 'src/enums/users.enums';

export class LoginDto {
  @ApiProperty()
  @IsMobilePhone()
  mobile: string;

  @ApiProperty()
  @IsNotEmpty({ message: `OTP ${VALIDATION_MESSAGES.emptyField}` })
  @IsString({ message: `OTP ${VALIDATION_MESSAGES.stringField}` })
  @Transform(({ value }) => value.trim())
  readonly otp: string;

  @ApiProperty({ enum: UserRole })
  @IsIn([UserRole.PSYCHOLOGIST, UserRole.ADMIN, UserRole.PATIENT])
  @Type(() => Number)
  readonly role: UserRole;
}
