import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OTPChannel } from 'src/enums/otp.enums';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendOtp(
    mobile: string,
    otp: string,
    channel: OTPChannel,
  ): Promise<void> {
    const from =
      channel === OTPChannel.WHATSAPP
        ? `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
        : process.env.TWILIO_PHONE_NUMBER;

    const to = channel === OTPChannel.WHATSAPP ? `whatsapp:${mobile}` : mobile;

    try {
      await this.client.messages.create({
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
        to,
        body: `رمز التحقق الخاص بك لتسجيل الدخول إلى تطبيق تحرر هو: ${otp}\n\nيرجى عدم مشاركة هذا الرمز مع أي شخص.`,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send OTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}