import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'));
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  app.setGlobalPrefix('api');

  await app.listen(3000, `${process.env.BASE_HOST}` || 'localhost');
}
bootstrap();
