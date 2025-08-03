import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ConsultationDto {
  @ApiProperty({
    type: String,
    example: 'This is notes',
    description: 'Notes for the consultation and this is optional',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes: string;

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
}

export class ListConsultationsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly size?: number = 4;
}
