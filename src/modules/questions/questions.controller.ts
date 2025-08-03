import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import {
  QuestionDto,
  ListQuestionsDto,
  AnswerQuestionDto,
} from './dto/question.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import {
  apiBadRequestResponse,
  apiUnauthorizedResponse,
  apiForbiddenResponse,
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
} from 'src/swagger/error.swagger';
import {
  AnswerQuestionResponseDto,
  CreateQuestionResponseDto,
  GetOneQuestionResponseDto,
  ListQuestionsResponseDto,
  QuestionResponseDto,
} from 'src/swagger/question/question.swagger';
import { RolesGuard } from '../auth/roles-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/users.enums';
import { ProfileCompleteGuard } from 'src/guards/profile-complete-guard';

@ApiTags('Questions')
@UseGuards(RolesGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT)
  @UseGuards(ProfileCompleteGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new question' })
  @ApiResponse({
    status: 201,
    description: 'Create new question.',
    type: CreateQuestionResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async create(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() questionDto: QuestionDto,
  ) {
    try {
      return this.questionsService.create(currentUser.id, questionDto);
    } catch (e) {
      throw new HttpException(
        'Error creating question',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT, UserRole.PSYCHOLOGIST)
  @Get('list')
  @ApiOperation({ summary: 'List all questions' })
  @ApiResponse({
    status: 200,
    description: 'List all questions.',
    type: ListQuestionsResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findAll(
    @CurrentUser() currentUser: CurrentUserDto,
    @Query() listQuestionsDto: ListQuestionsDto,
  ) {
    try {
      return this.questionsService.findAll(currentUser, listQuestionsDto);
    } catch (e) {
      throw new HttpException(
        'Error retrieving questions',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PATIENT, UserRole.PSYCHOLOGIST)
  @Get(':questionId')
  @ApiOperation({ summary: 'Get a single question by ID' })
  @ApiResponse({
    status: 200,
    description: 'Get a single question by ID.',
    type: GetOneQuestionResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findOne(@Param('questionId') id: string) {
    try {
      return this.questionsService.findOne(id);
    } catch (e) {
      throw new HttpException(
        'Error retrieving question',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.PSYCHOLOGIST)
  @Put(':questionId')
  @ApiOperation({ summary: 'Answer a question' })
  @ApiResponse({
    status: 200,
    description: 'Answer a question.',
    type: AnswerQuestionResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async answerQuestion(
    @Param('questionId') id: string,
    @Body() answerQuestionDto: AnswerQuestionDto,
  ) {
    try {
      return this.questionsService.answerQuestion(id, answerQuestionDto);
    } catch (e) {
      throw new HttpException(
        'Error answering question',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
