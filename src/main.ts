import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap().then(() =>
  console.log('Server is running on ' + `localhost` + ':3000'),
);
