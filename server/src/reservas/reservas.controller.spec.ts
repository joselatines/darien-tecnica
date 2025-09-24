import { Test, TestingModule } from '@nestjs/testing';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { PrismaService } from '../prisma.service';

describe('ReservasController', () => {
  let controller: ReservasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservasController],
      providers: [ReservasService, PrismaService],
    }).compile();

    controller = module.get<ReservasController>(ReservasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
