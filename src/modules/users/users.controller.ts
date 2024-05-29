import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get() // http://localhost/api/users -> GET
  async findAll() {
    return await this.usersService.findAll();
  }

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post() // http://localhost/api/users -> POST
  async create(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put(':id') // http://localhost/api/users:id -> PUT
  async upate(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    return await this.usersService.update(id, user);
  }

  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post('upload/:id') // http://localhost/api/users/upload/:id -> PUT
  @UseInterceptors(FileInterceptor('file'))
  async updateWithImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    return await this.usersService.updateWithImage(file, id, user);
  }
}
