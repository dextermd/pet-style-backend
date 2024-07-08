import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post() // http://localhost/api/pets -> POST
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file, @Body() createPetDto: CreatePetDto, @Req() req) {
    const userId = req.user.userId;
    return this.petsService.create(createPetDto, file, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user') // http://localhost/api/pets/user -> GET
  findAllByUserId(@Req() req) {
    const userId = req.user.userId;
    return this.petsService.findAllByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get() // http://localhost/api/pets -> GET
  findAll() {
    return this.petsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(+id, updatePetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(+id);
  }
}
