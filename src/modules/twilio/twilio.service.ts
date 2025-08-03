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
      if (channel === OTPChannel.WHATSAPP) {
        await this.client.messages.create({
          from,
          to,
          contentSid: process.env.TWILIO_CONTENT_SID,
          contentVariables: JSON.stringify({
            '1': `Your Be Free OTP is ${otp}`,
          }),
        } as any); // Cast to 'any' because of Twilio's SDK type limitations for contentSid
      } else {
        await this.client.messages.create({
          from,
          to,
          body: `Your Be Free OTP is ${otp}`,
        });
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send OTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}