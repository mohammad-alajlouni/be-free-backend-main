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
import { CoursesService } from './courses.service';
import { UserRole } from 'src/enums/users.enums';
import {
  apiBadRequestResponse,
  apiUnauthorizedResponse,
  apiForbiddenResponse,
  apiNotFoundResponse,
  apiInternalServerErrorResponse,
} from 'src/swagger/error.swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { ListCoursesDto, CourseDto } from './dto/course.dto';
import {
  CourseResponseDto,
  CreateOrUpateOrDeleteCourseResponseDto,
  ListCoursesResponseDto,
} from 'src/swagger/course/course.swagger';

@ApiTags('Courses')
@UseGuards(RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({
    status: 201,
    description: 'Create new course.',
    type: CourseResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async create(@Body() courseDto: CourseDto) {
    try {
      return this.coursesService.create(courseDto);
    } catch (e) {
      throw new HttpException('Error creating course', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Get('list')
  @ApiOperation({ summary: 'List all courses' })
  @ApiResponse({
    status: 200,
    description: 'List all courses.',
    type: ListCoursesResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findAll(@Query() listCoursesDto: ListCoursesDto) {
    try {
      return this.coursesService.findAll(listCoursesDto);
    } catch (e) {
      throw new HttpException(
        'Error retrieving courses',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Get(':courseId')
  @ApiOperation({ summary: 'Get a single course by ID' })
  @ApiResponse({
    status: 200,
    description: 'Get a single course by ID.',
    type: CourseResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findOne(@Param('courseId') id: string) {
    try {
      return this.coursesService.findOne(id);
    } catch (e) {
      throw new HttpException(
        'Error retrieving course',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Put(':courseId')
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully.',
    type: CreateOrUpateOrDeleteCourseResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async updateOne(
    @Param('courseId') courseId: string,
    @Body() courseDto: CourseDto,
  ) {
    try {
      return this.coursesService.updateOne(courseId, courseDto);
    } catch (e) {
      throw new HttpException('Error updating course', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Delete(':courseId')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({
    status: 200,
    description: 'Course deleted successfully.',
    type: CreateOrUpateOrDeleteCourseResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async deleteOne(@Param('courseId') courseId: string) {
    try {
      return this.coursesService.deleteOne(courseId);
    } catch (e) {
      throw new HttpException('Error deleting course', HttpStatus.BAD_REQUEST);
    }
  }
}
