import { forwardRef, Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { FilesService } from '../files/files.service';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet, User]),
    MulterModule.registerAsync({
      imports: [forwardRef(() => FilesModule)],
      useFactory: (filesService: FilesService) =>
        filesService.getMulterOptions({ folderName: 'pets' }),
      inject: [FilesService],
    }),
  ],
  controllers: [PetsController],
  providers: [PetsService, JwtService, FilesService],
})
export class PetsModule {}
