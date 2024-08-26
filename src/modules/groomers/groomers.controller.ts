import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroomersService } from './groomers.service';
import { CreateGroomerDto } from './dto/create-groomer.dto';
import { UpdateGroomerDto } from './dto/update-groomer.dto';

@Controller('groomers')
export class GroomersController {
  constructor(private readonly groomersService: GroomersService) {}

  @Post()
  create(@Body() createGroomerDto: CreateGroomerDto) {
    return this.groomersService.create(createGroomerDto);
  }

  @Get()
  findAll() {
    return this.groomersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groomersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroomerDto: UpdateGroomerDto) {
    return this.groomersService.update(+id, updateGroomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groomersService.remove(+id);
  }
}
