import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  app.setGlobalPrefix('api');
  Logger.log('Application is running...');
  await app.listen(3000, `${process.env.BASE_HOST}` || 'localhost');
  Logger.log('Application is running on: ' + process.env.BASE_HOST);
}
bootstrap();
