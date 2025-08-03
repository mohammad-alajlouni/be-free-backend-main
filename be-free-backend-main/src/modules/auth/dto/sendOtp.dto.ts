import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsPhoneNumber } from 'class-validator';
import { OTPChannel } from 'src/enums/otp.enums';
import { UserRole } from 'src/enums/users.enums';

export class sendOtpDto {
  @ApiProperty()
  @IsPhoneNumber()
  mobile: string;

  @ApiProperty({ enum: OTPChannel })
  @IsIn([OTPChannel.WHATSAPP, OTPChannel.SMS])
  @Type(() => Number)
  readonly channel: OTPChannel;

  @ApiProperty({ enum: UserRole })
  @IsIn([UserRole.PSYCHOLOGIST, UserRole.ADMIN, UserRole.PATIENT])
  @Type(() => Number)
  readonly role: UserRole;
}
