import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'node:path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groomer } from '../groomers/entities/groomer.entity';
import { Device } from '../devices/entities/device.entity';

@Injectable()
export class FirebaseService {
  constructor(
    @InjectRepository(Groomer) private groomerRepository: Repository<Groomer>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) {
    const serviceAccountPath = path.resolve(
      __dirname,
      '../../../serviceAccountKey.json',
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  }

  async sendNotification(
    fcmToken: string,
    title: string,
    body: string,
    data?: any,
  ) {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: data || {},
      token: fcmToken,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent multicast message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async sentMulticastNotification(
    clientId: any,
    title: string,
    body: string,
    data?: any,
  ) {
    const devices = await this.deviceRepository.find({
      where: {
        clientId: clientId,
      },
    });

    const fcmTokens = devices.map((device) => device.fcmToken);
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: data || {},
      tokens: fcmTokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(
        'Successfully sent multicast message:',
        response.successCount,
        'successes',
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async sendToGrooomer(
    groomerId: any,
    title: string,
    body: string,
    data?: any,
  ) {
    const groomer = await this.groomerRepository.findOne({
      where: {
        id: groomerId,
      },
    });

    const fcmToken = groomer.fcmToken;

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: data || {},
      token: fcmToken,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent multicast message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
