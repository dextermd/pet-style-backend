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
        filesService.getMulterOptions(),
      inject: [FilesService],
    }),

    // MulterModule.registerAsync({
    //   useFactory: async () => ({
    //     storage: diskStorage({
    //       destination: './uploads',
    //       filename: (req, file, cb) => {
    //         const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    //         const ext = file.originalname.split('.').pop();
    //         const newFilename = `${file.originalname.split('.')[0]}_${timestamp}.${ext}`;
    //         cb(null, newFilename);
    //       },
    //     }),
    //     fileFilter: (req, file, cb) => {
    //       if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    //         return cb(
    //           new ConflictException('Only image files are allowed!'),
    //           false,
    //         );
    //       }
    //       cb(null, true);
    //     },
    //     limits: { fileSize: 5 * 1024 * 1024 },
    //   }),
    // }),
  ],
  // imports: [
  //   MulterModule.register({
  //     dest: './uploads',
  //   }),
  // ],
  controllers: [FilesController],
  providers: [FilesService, JwtService],
  exports: [FilesService],
})
export class FilesModule {}
