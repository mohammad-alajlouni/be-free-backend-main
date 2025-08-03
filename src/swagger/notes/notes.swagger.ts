import { ApiProperty } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Patient notes retrieved successfully' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({
    example: {
      _id: '123456',
      patientId: 'patientId123',
      psychologistId: 'psychologistId456',
      content: 'The patient is progressing well...',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      __v: 0,
    },
  })
  data: {
    _id: string;
    patientId: string;
    psychologistId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export class NoteCreatedResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Note created successfully' })
  message: string;

  @ApiProperty({ example: 201 })
  statusCode: number;
}
