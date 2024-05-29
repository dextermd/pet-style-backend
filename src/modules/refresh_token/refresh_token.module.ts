import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh_token.service';
import { RefreshTokenController } from './refresh_token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh_token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, User])],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
})
export class RefreshTokenModule {}
