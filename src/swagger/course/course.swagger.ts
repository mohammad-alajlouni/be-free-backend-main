import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  videos: string[];

  @ApiProperty()
  goals: string[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  reviews: string[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  __v: number;
}

export class ListCoursesResponseDto {
  @ApiProperty({ type: [CourseResponseDto] })
  items: CourseResponseDto[];

  @ApiProperty()
  count: number;
}

export class CreateOrUpateOrDeleteCourseResponseDto {
  @ApiProperty()
  message: string;
}
