import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OtpService } from './otp.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}
  @Post('send-sms')
  @UseGuards(JwtAuthGuard)
  async sendSms(@Body('phone') phone: string) {
    return this.otpService.sendSms(phone);
  }
}
