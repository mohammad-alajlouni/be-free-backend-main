import { ApiProperty } from '@nestjs/swagger';

export class MeetingResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  video: string;

  @ApiProperty()
  goals: string[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  __v: number;
}

export class ListMeetingsResponseDto {
  @ApiProperty({ type: [MeetingResponseDto] })
  items: MeetingResponseDto[];

  @ApiProperty()
  count: number;
}

export class CreateOrUpateOrDeleteMeetingResponseDto {
  @ApiProperty()
  message: string;
}
