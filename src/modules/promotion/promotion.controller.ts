import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'node:fs';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @UploadedFile() file: any,
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    try {
      return await this.promotionService.create(createPromotionDto, file);
    } catch (error) {
      if (file?.path) {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Ошибка при удалении файла:', err);
          }
        });
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.promotionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.promotionService.findOne(+id);
  }

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @UploadedFile() file: any,
  ) {
    try {
      return await this.promotionService.update(+id, updatePromotionDto, file);
    } catch (error) {
      if (file?.path) {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Ошибка при удалении файла:', err);
          }
        });
      }
      throw error;
    }
  }

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.promotionService.remove(+id);
  }
}
