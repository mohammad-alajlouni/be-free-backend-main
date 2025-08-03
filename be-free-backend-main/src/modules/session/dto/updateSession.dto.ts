import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdatedSessionDto {
  @ApiProperty({
    type: String,
    example: '64d97510859dc4f83d9dc0c8',
    description: 'Should provide doctor id to fetch schedule day details',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'Invalid day id' })
  dayId: string;

  @ApiProperty({
    type: String,
    example: '64d97510859dc4f83d9dc0c8',
    description: 'Should provide doctor id to fetch time range details',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'Invalid time range id' })
  timeRangeId: string;
}
