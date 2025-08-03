import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles-auth.guard';
import { RatingsService } from './ratings.service';
import { UserRole } from 'src/enums/users.enums';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  apiBadRequestResponse,
  apiForbiddenResponse,
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
  apiUnauthorizedResponse,
} from 'src/swagger/error.swagger';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  AddRatingResponseDto,
  ListRatingsResponseDto,
  RatingResponseDto,
} from 'src/swagger/rating/rating.swagger';
import { ListRatingsDto, RatingDto } from './dto/rating.dto';
import { ProfileCompleteGuard } from 'src/guards/profile-complete-guard';

@ApiTags('Ratings')
@UseGuards(RolesGuard)
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT)
  @UseGuards(ProfileCompleteGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new rating' })
  @ApiResponse({
    status: 201,
    description: 'Create new rating.',
    type: AddRatingResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async create(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() ratingDto: RatingDto,
  ) {
    try {
      return this.ratingsService.create(currentUser.id, ratingDto);
    } catch (e) {
      throw new HttpException('Error creating rating', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT, UserRole.PSYCHOLOGIST)
  @Get('list')
  @ApiOperation({ summary: 'List all ratings' })
  @ApiResponse({
    status: 200,
    description: 'List all ratings.',
    type: ListRatingsResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findAll(
    @CurrentUser() currentUser: CurrentUserDto,
    @Query() listRatingsDto: ListRatingsDto,
  ) {
    try {
      return this.ratingsService.findAll(currentUser, listRatingsDto);
    } catch (e) {
      throw new HttpException(
        'Error retrieving ratings',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @Get(':ratingId')
  @ApiOperation({ summary: 'Get a single rating by ID' })
  @ApiResponse({
    status: 200,
    description: 'Get a single rating by ID.',
    type: RatingResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findOne(@Param('ratingId') id: string) {
    try {
      return this.ratingsService.findOne(id);
    } catch (e) {
      throw new HttpException(
        'Error retrieving rating',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
