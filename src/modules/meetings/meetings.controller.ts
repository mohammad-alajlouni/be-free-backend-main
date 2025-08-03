import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { MeetingsService } from './meetings.service';
import { UserRole } from 'src/enums/users.enums';
import {
  apiBadRequestResponse,
  apiUnauthorizedResponse,
  apiForbiddenResponse,
  apiNotFoundResponse,
  apiInternalServerErrorResponse,
} from 'src/swagger/error.swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { ListMeetingsDto, MeetingDto } from './dto/meeting.dto';
import {
  CreateOrUpateOrDeleteMeetingResponseDto,
  ListMeetingsResponseDto,
  MeetingResponseDto,
} from 'src/swagger/meeting/meeting.swagger';

@ApiTags('Meetings')
@UseGuards(RolesGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new meeting' })
  @ApiResponse({
    status: 201,
    description: 'Create new meeting.',
    type: CreateOrUpateOrDeleteMeetingResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async create(@Body() meetingDto: MeetingDto) {
    try {
      return this.meetingsService.create(meetingDto);
    } catch (e) {
      throw new HttpException('Error creating meeting', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Get('list')
  @ApiOperation({ summary: 'List all meetings' })
  @ApiResponse({
    status: 200,
    description: 'List all meetings.',
    type: ListMeetingsResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findAll(@Query() listMeetingsDto: ListMeetingsDto) {
    try {
      return this.meetingsService.findAll(listMeetingsDto);
    } catch (e) {
      throw new HttpException(
        'Error retrieving meetings',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Get(':meetingId')
  @ApiOperation({ summary: 'Get a single meeting by ID' })
  @ApiResponse({
    status: 200,
    description: 'Get a single meeting by ID.',
    type: MeetingResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findOne(@Param('meetingId') id: string) {
    try {
      return this.meetingsService.findOne(id);
    } catch (e) {
      throw new HttpException(
        'Error retrieving meeting',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Put(':meetingId')
  @ApiOperation({ summary: 'Update a meeting' })
  @ApiResponse({
    status: 200,
    description: 'Meeting updated successfully.',
    type: CreateOrUpateOrDeleteMeetingResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async updateOne(
    @Param('meetingId') meetingId: string,
    @Body() meetingDto: MeetingDto,
  ) {
    try {
      return this.meetingsService.updateOne(meetingId, meetingDto);
    } catch (e) {
      throw new HttpException('Error updating meeting', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Delete(':meetingId')
  @ApiOperation({ summary: 'Delete a meeting' })
  @ApiResponse({
    status: 200,
    description: 'Meeting deleted successfully.',
    type: CreateOrUpateOrDeleteMeetingResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async deleteOne(@Param('meetingId') meetingId: string) {
    try {
      return this.meetingsService.deleteOne(meetingId);
    } catch (e) {
      throw new HttpException('Error deleting meeting', HttpStatus.BAD_REQUEST);
    }
  }
}
