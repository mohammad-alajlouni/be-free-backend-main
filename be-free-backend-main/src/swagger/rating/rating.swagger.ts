import { ApiProperty } from '@nestjs/swagger';

export class RatingResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  sessionRating: number;

  @ApiProperty()
  doctoRating: number;

  @ApiProperty()
  sessionComment: string;

  @ApiProperty()
  doctoComment: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  __v: number;
}

export class ListRatingsResponseDto {
  @ApiProperty({ type: [RatingResponseDto] })
  items: RatingResponseDto[];

  @ApiProperty()
  count: number;
}

export class AddRatingResponseDto {
  @ApiProperty()
  message: string;
}
