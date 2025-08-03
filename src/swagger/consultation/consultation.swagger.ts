import { ApiProperty } from '@nestjs/swagger';

export class ConsultationResponseDto {
  @ApiProperty({ example: '6123abcde12345f67890abcd' })
  _id: string;

  @ApiProperty({ example: '1234567890abcdef12345678' })
  patientId: string;

  @ApiProperty({ example: 1 })
  numberOfSessions: 1;

  @ApiProperty({ example: 30 })
  duration: 30;

  @ApiProperty({ example: 'Consultaion' })
  sessionType: 'Consultaion';

  @ApiProperty({ example: 'I feel sick' })
  notes: 'I feel sick';

  @ApiProperty({
    example: {
      fullName: 'Mohamed',
      profilePicture: 'test',
    },
    description: 'Patient data',
  })
  patientDetails: {
    fullName: string;
    profilePicture: string;
  };

  @ApiProperty({ example: '2023-09-20T15:45:00Z' })
  createdAt: string;
}

export class GetOneConsultationResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Consultation retrieved successfully' })
  message: string;

  @ApiProperty({
    example: {
      _id: '6123abcde12345f67890abcd',
      patientId: '1234567890abcdef12345678',
      numberOfSessions: 1,
      duration: 30,
      sessionType: 'Consultaion',
      notes: 'I feel sick',
      createdAt: '2023-09-20T15:45:00Z',
      patientDetails: {
        fullName: 'Mohamed',
        profilePicture: 'test',
      },
    },
  })
  data: ConsultationResponseDto;
}

export class ListConsultationsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Consultations retrieved successfully' })
  message: string;

  @ApiProperty({
    example: {
      items: [
        {
          _id: '6123abcde12345f67890abcd',
          patientId: '1234567890abcdef12445878',
          numberOfSessions: 1,
          duration: 30,
          sessionType: 'Consultaion',
          notes: 'I feel sick',
          createdAt: '2023-09-20T15:45:00Z',
          patientDetails: {
            fullName: 'Mohamed',
            profilePicture: 'test',
          },
        },
        {
          _id: '6123abcde12345f67890abcd',
          patientId: '1234567890abcdef12345678',
          numberOfSessions: 1,
          duration: 30,
          sessionType: 'Consultaion',
          notes: 'I feel good',
          createdAt: '2023-09-20T15:45:00Z',
          patientDetails: {
            fullName: 'Mohamed',
            profilePicture: 'test',
          },
        },
      ],
      count: 2,
    },
  })
  data: {
    items: ConsultationResponseDto[];
    count: number;
  };
}

export class CreateConsultationResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Consultation created successfully' })
  message: string;

  @ApiProperty({
    example: {
      _id: '6123abcde12345f67890abcd',
      patientId: '1234567890abcdef12345678',
      numberOfSessions: 1,
      duration: 30,
      sessionType: 'Consultaion',
      notes: 'I feel sick',
      createdAt: '2023-09-20T15:45:00Z',
    },
  })
  data: ConsultationResponseDto;
}
