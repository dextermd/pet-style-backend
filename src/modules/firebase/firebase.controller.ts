import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('send-notification')
  async sendNotification(
    @Body('fcmToken') fcmToken: string,
    @Body('title') title: string,
    @Body('body') body: string,
  ) {
    return await this.firebaseService.sendNotification(fcmToken, title, body);
  }
}
