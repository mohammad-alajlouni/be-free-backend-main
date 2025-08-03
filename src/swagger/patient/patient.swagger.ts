import { ApiProperty } from '@nestjs/swagger';

export class PatientResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Patient profile retrieved successfully' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({
    example: {
      _id: '123456',
      mobile: '1234567890',
      role: 2,
      isActivated: true,
      otp: 1234,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      __v: 0,
    },
  })
  data: {
    _id: string;
    mobile: string;
    role: number;
    isActivated: boolean;
    otp: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export const apiOkResponse = {
  status: 200,
  description: 'Complete data.',
  schema: {
    example: {
      success: true,
      statusCode: 200,
      message: 'Patient data completed successfully.',
    },
  },
};

export const apiUpdateResponse = {
  status: 200,
  description: 'Patient profile.',
  schema: {
    example: {
      success: true,
      statusCode: 200,
      message: 'Patient data updated successfully.',
    },
  },
};
