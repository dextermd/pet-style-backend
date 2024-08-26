import { Test, TestingModule } from '@nestjs/testing';
import { GroomersController } from './groomers.controller';
import { GroomersService } from './groomers.service';

describe('GroomersController', () => {
  let controller: GroomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroomersController],
      providers: [GroomersService],
    }).compile();

    controller = module.get<GroomersController>(GroomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
