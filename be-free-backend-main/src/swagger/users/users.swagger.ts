import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'User updated successfully' })
  message: string;
}

export const apiFullNameSearchQuery = {
  name: 'search',
  type: String,
  description: 'Should provide search query to filter doctors by name',
  example: 'Mahmoud Serag',
  required: false,
};

export const apiLanguageSearchQuery = {
  name: 'language',
  type: String,
  description: 'Should provide search query to filter doctors by language',
  example: 'arabic',
  required: false,
};

export const apiMinPriceSearchQuery = {
  name: 'minPrice',
  type: String,
  description: 'Should provide search query to filter doctors by minimum price',
  example: 50,
  required: false,
};

export const apiMaxPriceSearchQuery = {
  name: 'maxPrice',
  type: String,
  description: 'Should provide search query to filter doctors by maximum price',
  example: 100,
  required: false,
};

export const apiGenderSearchQuery = {
  name: 'gender',
  type: Number,
  description: 'Should provide search query to filter doctors by gender',
  example: 1,
  required: false,
};

export const apiSpecializationSearchQuery = {
  name: 'specialization',
  type: String,
  description:
    'Should provide search query to filter doctors by specialization',
  example: 'dentist',
  required: false,
};

export const apiConsultationTypeSearchQuery = {
  name: 'consultationType',
  type: String,
  description:
    'Should provide search query to filter doctors by consultation type',
  example: 'video',
  required: false,
};

export const apiPageSearchQuery = {
  name: 'page',
  type: Number,
  description:
    'Should provide search query to return page number of doctors returned',
  example: 1,
  required: false,
};

export const apiLimitSearchQuery = {
  name: 'limit',
  type: Number,
  description:
    'Should provide search query to limit the number of doctors returned',
  example: 4,
  required: false,
};

export const apiDoctorIdParam = {
  name: 'doctorId',
  type: String,
  description:
    'Should provide doctorId to fetch details of the specific doctor',
  example: '66dc1b219294b6a18a31413a',
  required: true,
};

export const apiPatientIdParam = {
  name: 'patientId',
  type: String,
  description:
    'Should provide patientId to fetch details of the specific patient',
  example: '66dc1b219294b6a18a31413a',
  required: true,
};
