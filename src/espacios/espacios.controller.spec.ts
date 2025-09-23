import { Test, TestingModule } from '@nestjs/testing';
import { EspaciosController } from './espacios.controller';
import { EspaciosService } from './espacios.service';

describe('EspaciosController', () => {
  let controller: EspaciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspaciosController],
      providers: [EspaciosService],
    }).compile();

    controller = module.get<EspaciosController>(EspaciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
