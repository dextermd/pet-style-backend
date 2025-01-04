import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groomer } from '../groomers/entities/groomer.entity';
import { Device } from '../devices/entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Groomer, Device])],
  controllers: [FirebaseController],
  providers: [FirebaseService],
})
export class FirebaseModule {}
