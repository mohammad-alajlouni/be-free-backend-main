import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class NotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly body: string;
}

export class ListNotificationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly size?: number = 4;
}
