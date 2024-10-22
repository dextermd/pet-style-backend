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

  @Post('verify-sms')
  @UseGuards(JwtAuthGuard)
  async verifySms(@Body('phone') phone: string, @Body('code') code: string) {
    return this.otpService.verifySms(phone, code);
  }
}
