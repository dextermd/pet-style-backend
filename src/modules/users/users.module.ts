import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles/entities/role.entity';
import { RefreshToken } from '../refresh_token/entities/refresh_token.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

import { FilesService } from '../files/files.service';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, RefreshToken, Pet, Appointment]),
    MulterModule.registerAsync({
      imports: [forwardRef(() => FilesModule)],
      useFactory: (filesService: FilesService) =>
        filesService.getMulterOptions(),
      inject: [FilesService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, FilesService],
  exports: [UsersService],
})
export class UsersModule {}
