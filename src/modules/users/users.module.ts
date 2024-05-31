import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles/entities/role.entity';
import { RefreshToken } from '../refresh_token/entities/refresh_token.entity';
import { Pet } from '../pets/entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, RefreshToken, Pet])],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
