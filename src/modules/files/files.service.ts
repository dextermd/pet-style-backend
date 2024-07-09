import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { MulterModuleOptions } from '@nestjs/platform-express';

@Injectable()
export class FilesService {
  private readonly uploadPath = './uploads';
  private readonly maxFileSize = 5 * 1024 * 1024;

  getMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
          const ext = file.originalname.split('.').pop();
          const newFilename = `${file.originalname.split('.')[0]}_${timestamp}.${ext}`;
          cb(null, newFilename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new ConflictException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: this.maxFileSize },
    };
  }

  async handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }
    return { filename: file.filename, message: 'File uploaded successfully' };
  }

  async getFilePath(fileName: string): Promise<string> {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      this.uploadPath,
      fileName,
    );
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    return filePath;
  }

  async deleteFile(photo: string) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      this.uploadPath,
      photo,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
