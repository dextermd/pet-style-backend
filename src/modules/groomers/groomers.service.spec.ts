import { Test, TestingModule } from '@nestjs/testing';
import { GroomersService } from './groomers.service';

describe('GroomersService', () => {
  let service: GroomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroomersService],
    }).compile();

    service = module.get<GroomersService>(GroomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
