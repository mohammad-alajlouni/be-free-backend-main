import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  __v: number;
}

export class ListNotificationsResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Notifications retrieved successfully' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({
    example: {
      items: [
        {
          _id: '123456',
          userId: 'userId789',
          body: 'You have a new message',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          __v: 0,
        },
        {
          _id: '789123',
          userId: 'userId101112',
          body: 'Your session has been confirmed',
          createdAt: '2023-01-01T01:00:00Z',
          updatedAt: '2023-01-01T01:00:00Z',
          __v: 0,
        },
      ],
      count: 2,
    },
  })
  data: {
    items: NotificationResponseDto[];
    count: number;
  };
}
