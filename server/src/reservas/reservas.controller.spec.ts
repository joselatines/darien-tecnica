import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { EspaciosService } from '../espacios/espacios.service';
import { ClientsService } from '../clients/clients.service';
import { PrismaService } from '../prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

describe('ReservasController', () => {
  let controller: ReservasController;
  let espaciosService: EspaciosService;
  let clientsService: ClientsService;
  let espacioId: string;
  let clientId: string;
  let reservaId: string;
  const testDate = new Date('2025-01-01');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservasController],
      providers: [
        ReservasService,
        EspaciosService,
        ClientsService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<ReservasController>(ReservasController);
    espaciosService = module.get<EspaciosService>(EspaciosService);
    clientsService = module.get<ClientsService>(ClientsService);

    // Create test espacio
    const espacio = await espaciosService.create({
      name: `Test Espacio ${Date.now()}`,
      capacity: 10,
      description: 'Test space',
      location: 'Test location',
    });
    espacioId = espacio.id;

    // Create test client
    const client = await clientsService.create({
      email: `test${Date.now()}@example.com`,
    });
    if (client) {
      clientId = client.id;
    } else {
      throw new Error('Failed to create test client');
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a reserva', async () => {
    const dto: CreateReservaDto = {
      espacioId,
      clientId,
      reservationDate: testDate,
      startTime: '10:00',
      endTime: '11:00',
      status: 'confirmed',
    };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
    reservaId = result.id;
  });

  it('should not create a reserva exceeding max reservations per week', async () => {
    // Create max reservations (3) in the same week
    for (let i = 0; i < 3; i++) {
      const dto: CreateReservaDto = {
        espacioId,
        clientId,
        reservationDate: new Date(testDate.getTime() + i * 24 * 60 * 60 * 1000), // Different days in same week
        startTime: '10:00',
        endTime: '11:00',
        status: 'confirmed',
      };
      await controller.create(dto);
    }
    // Try to create one more in the same week
    const dto: CreateReservaDto = {
      espacioId,
      clientId,
      reservationDate: new Date(testDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      startTime: '10:00',
      endTime: '11:00',
      status: 'confirmed',
    };
    await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should not create a reserva with time conflict', async () => {
    // Create first reserva
    const dto1: CreateReservaDto = {
      espacioId,
      clientId,
      reservationDate: testDate,
      startTime: '10:00',
      endTime: '12:00',
      status: 'confirmed',
    };
    await controller.create(dto1);

    // Try overlapping reserva
    const dto2: CreateReservaDto = {
      espacioId,
      clientId,
      reservationDate: testDate,
      startTime: '11:00',
      endTime: '13:00',
      status: 'confirmed',
    };
    await expect(controller.create(dto2)).rejects.toThrow(BadRequestException);
  });

  it('should find all reservas', async () => {
    const result = await controller.findAll();
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('should find one reserva', async () => {
    const result = await controller.findOne(reservaId);
    expect(result).toHaveProperty('id', reservaId);
  });

  it('should not find non-existing reserva', async () => {
    await expect(controller.findOne('non-existing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a reserva', async () => {
    const dto: UpdateReservaDto = {
      status: 'pending',
    };
    const result = await controller.update(reservaId, dto);
    expect(result).toHaveProperty('id', reservaId);
    expect(result.status).toBe('pending');
  });

  it('should update same reserva with time conflict', async () => {
    // Create another reserva on same day
    const dto1: CreateReservaDto = {
      espacioId,
      clientId,
      reservationDate: testDate,
      startTime: '14:00',
      endTime: '15:00',
      status: 'confirmed',
    };
    const reserva2 = await controller.create(dto1);

    // Try to update first reserva to overlap
    const dto: UpdateReservaDto = {
      reservationDate: testDate,
      startTime: '14:30',
      endTime: '16:00',
    };

    const result = await controller.update(reservaId, dto);
    expect(result).toHaveProperty('id', reservaId);
  });

  it('should not update non-existing reserva', async () => {
    const dto: UpdateReservaDto = {
      status: 'cancelled',
    };
    await expect(controller.update('non-existing-id', dto)).rejects.toThrow();
  });

  it('should remove a reserva', async () => {
    const result = await controller.remove(reservaId);
    expect(result).toHaveProperty('id', reservaId);
  });

  it('should not remove non-existing reserva', async () => {
    await expect(controller.remove('non-existing-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
