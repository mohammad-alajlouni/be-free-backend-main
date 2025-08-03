import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../auth/dto/currentUser.dto';
import { ListNotificationDto } from './dto/notifications.dto';
import {
  apiBadRequestResponse,
  apiForbiddenResponse,
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
  apiUnauthorizedResponse,
} from 'src/swagger/error.swagger';
import { ListNotificationsResponseDto } from 'src/swagger/notification/notification.swagger';

@ApiTags('Notifications')
@UseGuards(RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiBearerAuth()
  @Get('list/user')
  @ApiOperation({ summary: 'List all notifications for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of all notifications for a user',
    type: ListNotificationsResponseDto,
  })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiForbiddenResponse(apiForbiddenResponse)
  @ApiNotFoundResponse(apiNotFoundResponse)
  @ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
  async findUserNotifications(
    @CurrentUser() currentUser: CurrentUserDto,
    @Query() listNotificationDto: ListNotificationDto,
  ) {
    try {
      return this.notificationsService.findUserNotifications(
        currentUser.id,
        listNotificationDto,
      );
    } catch (e) {
      throw new HttpException(
        'Error in getting user notifications',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
