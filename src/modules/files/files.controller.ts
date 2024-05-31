import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  forwardRef,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';
import * as path from 'path';

interface FileParams {
  filename: string;
}

@Controller('files')
export class FilesController {
  constructor(
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
  ) {}

  @Post('/upload') // http://localhost/api/files/upload -> POST
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return this.filesService.handleFileUpload(file);
  }

  @Get('/getFile') // http://localhost/api/files/getFile -> GET
  getFile(@Res() res, @Body() file: FileParams) {
    res.sendFile(
      path.join(__dirname, '..', '..', '..', 'uploads', file.filename),
    );
  }
}
