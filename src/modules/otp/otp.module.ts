import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpCodeLog } from './entities/otp-code-log.entity';
import { OtpCodeStorage } from './entities/otp-code-storage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtpCodeLog, OtpCodeStorage])],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
