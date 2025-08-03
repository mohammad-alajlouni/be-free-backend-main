import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import {
  apiBadRequestResponse,
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
  apiUnauthorizedResponse,
} from 'src/swagger/error.swagger';
import {
  apiConsultationTypeSearchQuery,
  apiDoctorIdParam,
  apiFullNameSearchQuery,
  apiLanguageSearchQuery,
  apiLimitSearchQuery,
  apiPageSearchQuery,
  apiMinPriceSearchQuery,
  apiMaxPriceSearchQuery,
  apiSpecializationSearchQuery,
  apiGenderSearchQuery,
  apiPatientIdParam,
} from 'src/swagger/users/users.swagger';
import { RolesGuard } from '../auth/roles-auth.guard';
import { UserRole } from 'src/enums/users.enums';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Doctors')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiQuery(apiFullNameSearchQuery)
  @ApiQuery(apiLanguageSearchQuery)
  @ApiQuery(apiMinPriceSearchQuery)
  @ApiQuery(apiMaxPriceSearchQuery)
  @ApiQuery(apiSpecializationSearchQuery)
  @ApiQuery(apiGenderSearchQuery)
  @ApiQuery(apiConsultationTypeSearchQuery)
  @ApiQuery(apiPageSearchQuery)
  @ApiQuery(apiLimitSearchQuery)
  @Get('search')
  @ApiOperation({ summary: 'Search or filter doctors' })
  async searchOrFilterDoctor(
    @CurrentUser() currentUser: CurrentUserDto,
    @Query('search') search: string,
    @Query('language') language: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('specialization') specialization: string,
    @Query('gender') gender: number,
    @Query('consultationType') consultationType: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.usersService.searchOrFilterDoctor(
      currentUser,
      [
        search,
        language,
        minPrice,
        maxPrice,
        specialization,
        gender,
        consultationType,
      ],
      page || 1,
      limit || 4,
    );
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiParam(apiDoctorIdParam)
  @Get(':doctorId')
  @ApiOperation({ summary: 'Get doctor by id' })
  async getDoctorById(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('doctorId') doctorId: string,
  ) {
    return this.usersService.getDoctorById(currentUser, doctorId);
  }

  @Roles(UserRole.PSYCHOLOGIST)
  @ApiBearerAuth()
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  @ApiParam(apiPatientIdParam)
  @Get('/patient/:patientId')
  @ApiOperation({ summary: 'Get patient by id' })
  async getPatientById(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('patientId') patientId: string,
  ) {
    return this.usersService.getPatientById(patientId);
  }
}
