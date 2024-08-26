import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentExceptionsService } from './appointment_exceptions.service';

describe('AppointmentExceptionsService', () => {
  let service: AppointmentExceptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentExceptionsService],
    }).compile();

    service = module.get<AppointmentExceptionsService>(AppointmentExceptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
