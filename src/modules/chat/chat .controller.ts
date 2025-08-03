import { Controller, UseGuards, Get, Query, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiProduces, ApiTags } from '@nestjs/swagger';
import { ChatGuard } from './chat.guard';

@ApiProduces('application/json')
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiProduces('application/json')
  @ApiBearerAuth()
  @UseGuards(ChatGuard)
  @Get('/history')
  async getChatHistory(@Query('roomId') roomId: string) {
    return await this.chatService.getChatHistory(roomId);
  }

  @ApiProduces('application/json')
  @ApiBearerAuth()
  @Get('/rooms')
  async getRooms(@Req() req: Request) {
    const userID = (req as any).user.id;
    return await this.chatService.getRooms(userID);
  }
}
