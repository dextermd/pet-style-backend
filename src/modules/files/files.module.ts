import { Module, forwardRef } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [forwardRef(() => FilesModule)],
      useFactory: (filesService: FilesService) =>
        filesService.getMulterOptions({ folderName: 'other' }),
      inject: [FilesService],
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, JwtService],
  exports: [FilesService],
})
export class FilesModule {}
