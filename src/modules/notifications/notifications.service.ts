import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ListNotificationDto, NotificationDto } from './dto/notifications.dto';
import mongoose, { Model, PipelineStage } from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,
  ) {}

  async findUserNotifications(id: string, payload: ListNotificationDto) {
    const { page = 1, size = 4 } = payload;

    const correctedPage = Math.max(page, 1);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userIds: { $in: [id] },
        },
      },
      // Sort by createdAt
      { $sort: { createdAt: -1 } },
      // Apply pagination
      {
        $facet: {
          items: [{ $skip: (+correctedPage - 1) * +size }, { $limit: +size }],
          count: [{ $count: 'count' }],
        },
      },
    ];

    const [{ items, count }] = await this.notificationModel.aggregate(pipeline);

    return {
      success: true,
      message: 'Notifications retrieved successfully',
      statusCode: HttpStatus.OK,
      date: {
        items,
        count: count.length > 0 ? count[0].count : 0,
      },
    };
  }

  async create(payload: NotificationDto): Promise<any> {
    const newNotificationId = new mongoose.Types.ObjectId().toString();

    await this.notificationModel.create({
      ...payload,
      _id: newNotificationId,
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Notification Created Successfully',
    };
  }
}
