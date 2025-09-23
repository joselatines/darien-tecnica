import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EspaciosController } from './espacios.controller';
import { EspaciosService } from './espacios.service';
import { PrismaService } from '../prisma.service';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';

describe('EspaciosController', () => {
  let controller: EspaciosController;
  let itemId: string;
  let dtoName = `Espacio ${Date.now()}`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspaciosController],
      providers: [EspaciosService, PrismaService],
    }).compile();

    controller = module.get<EspaciosController>(EspaciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a espacio', async () => {
    const dto: CreateEspacioDto = {
      name: dtoName,
      capacity: 10,
      description: 'Sala de reuniones',
      location: 'Caracas',
    };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
    itemId = result.id;
  });

  it('should not create a espacio with existing name', async () => {
    const dto: CreateEspacioDto = {
      name: dtoName,
      capacity: 20,
      description: 'Sala 2 de reuniones',
      location: 'Caracas',
    };
    await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should create another espacio', async () => {
    const dto: CreateEspacioDto = {
      name: `${dtoName} 2`,
      capacity: 15,
      description: 'Sala 2',
      location: 'Caracas',
    };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
  });

  it('should find all espacios', async () => {
    const result = await controller.findAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should find one espacio', async () => {
    const result = await controller.findOne(itemId);
    expect(result).toHaveProperty('id', itemId);
  });

  it('should update a espacio', async () => {
    const dto: UpdateEspacioDto = {
      name: `Updated ${dtoName}`,
      capacity: 15,
    };
    const result = await controller.update(itemId, dto);
    expect(result).toHaveProperty('id', itemId);
    expect(result.capacity).toBe(15);
  });

  it('should not update to existing name', async () => {
    const dto: UpdateEspacioDto = {
      name: `${dtoName} 2`,
    };
    await expect(controller.update(itemId, dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should remove a espacio', async () => {
    const result = await controller.remove(itemId);
    expect(result).toHaveProperty('id', itemId);
  });

  it('should not remove non-existing espacio', async () => {
    await expect(controller.remove('non-existing-id')).rejects.toThrow(
      BadRequestException,
    );
  });
});
