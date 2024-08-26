import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentExceptionsController } from './appointment_exceptions.controller';
import { AppointmentExceptionsService } from './appointment_exceptions.service';

describe('AppointmentExceptionsController', () => {
  let controller: AppointmentExceptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentExceptionsController],
      providers: [AppointmentExceptionsService],
    }).compile();

    controller = module.get<AppointmentExceptionsController>(AppointmentExceptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
