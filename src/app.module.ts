import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { RefreshTokenModule } from './modules/refresh_token/refresh_token.module';
import { PetsModule } from './modules/pets/pets.module';
import { FilesModule } from './modules/files/files.module';

import dbConfiguration from './db/config/db.config';
import { AdminModule } from './admin.module';
import { GroomersModule } from './modules/groomers/groomers.module';
import { AppointmentExceptionsModule } from './modules/appointment_exceptions/appointment_exceptions.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    RefreshTokenModule,
    PetsModule,
    FilesModule,
    AdminModule,
    GroomersModule,
    AppointmentExceptionsModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
