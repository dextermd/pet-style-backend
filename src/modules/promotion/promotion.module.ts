import { forwardRef, Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from '../files/files.module';
import { FilesService } from '../files/files.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion]),
    MulterModule.registerAsync({
      imports: [forwardRef(() => FilesModule)],
      useFactory: (filesService: FilesService) =>
        filesService.getMulterOptions({ folderName: 'promotions' }),
      inject: [FilesService],
    }),
  ],

  controllers: [PromotionController],
  providers: [PromotionService, JwtService, FilesService],
})
export class PromotionModule {}
