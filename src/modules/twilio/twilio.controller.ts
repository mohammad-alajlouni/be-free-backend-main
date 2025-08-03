import { Body, Controller, Post } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { OTPChannel } from 'src/enums/otp.enums';

@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('send')
  async sendOtp(@Body('mobile') mobile: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const channel: OTPChannel = OTPChannel.SMS; // أو OTPChannel.WHATSAPP حسب الحالة

    await this.twilioService.sendOtp(mobile, otp, channel);

    // هنا احفظ الـ OTP مؤقتًا في قاعدة بيانات أو في Redis (اختياري)
    return { success: true, message: 'OTP sent', otp }; // otp فقط للعرض التجريبي
  }
}