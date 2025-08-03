import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class ListUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly search?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly size?: number = 4;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  readonly sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  readonly planName?: string = '';
}
