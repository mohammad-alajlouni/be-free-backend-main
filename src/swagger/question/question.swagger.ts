import { ApiProperty } from '@nestjs/swagger';

export class QuestionResponseDto {
  @ApiProperty({ example: '6123abcde12345f67890abcd' })
  _id: string;

  @ApiProperty({ example: '1234567890abcdef12345678' })
  userId: string;

  @ApiProperty({ example: 'What is the capital of France?' })
  question: string;

  @ApiProperty({ example: 'Paris' })
  answer: string;

  @ApiProperty({
    example: 1,
    description: 'Status of the question (1: active, 0: inactive)',
  })
  status: number;

  @ApiProperty({
    example: {
      _id: '123456',
      mobile: '1234567890',
      role: 2,
      isActivated: true,
      profilePicture: 'test',
      otp: 1234,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      __v: 0,
    },
    description: 'Patient data',
  })
  patientData: {
    _id: string;
    mobile: string;
    role: number;
    isActivated: boolean;
    profilePicture: string;
    otp: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };

  @ApiProperty({ example: '2023-09-20T15:45:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-09-22T10:20:00Z' })
  updatedAt: string;

  @ApiProperty({ example: 0 })
  __v: number;
}

export class GetOneQuestionResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Question retrieved successfully' })
  message: string;

  @ApiProperty({
    example: {
      _id: '6123abcde12345f67890abcd',
      userId: '1234567890abcdef12345678',
      question: 'What is the capital of France?',
      answer: 'Paris',
      status: 1,
      createdAt: '2023-09-20T15:45:00Z',
      updatedAt: '2023-09-22T10:20:00Z',
      __v: 0,
    },
  })
  data: QuestionResponseDto;
}

export class ListQuestionsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Questions retrieved successfully' })
  message: string;

  @ApiProperty({
    example: {
      items: [
        {
          _id: '6123abcde12345f67890abcd',
          userId: '1234567890abcdef12345678',
          question: 'What is the capital of France?',
          answer: 'Paris',
          status: 1,
          createdAt: '2023-09-20T15:45:00Z',
          updatedAt: '2023-09-22T10:20:00Z',
          __v: 0,
        },
        {
          _id: '67890abcdef1234567890abc',
          userId: 'abcdef1234567890abcdef12',
          question: 'What is the capital of Italy?',
          answer: 'Rome',
          status: 1,
          createdAt: '2023-09-20T15:45:00Z',
          updatedAt: '2023-09-22T10:20:00Z',
          __v: 0,
        },
      ],
      count: 2,
    },
  })
  data: {
    items: QuestionResponseDto[];
    count: number;
  };
}

export class AnswerQuestionResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Answer submitted successfully' })
  message: string;
}

export class CreateQuestionResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Question created successfully' })
  message: string;

  @ApiProperty({
    example: {
      _id: '6123abcde12345f67890abcd',
      userId: '1234567890abcdef12345678',
      question: 'What is the capital of France?',
      answer: 'Paris',
      status: 1,
      createdAt: '2023-09-20T15:45:00Z',
      updatedAt: '2023-09-22T10:20:00Z',
      __v: 0,
    },
  })
  data: QuestionResponseDto;
}
