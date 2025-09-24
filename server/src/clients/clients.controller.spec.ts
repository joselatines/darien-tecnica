import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

describe('ClientsController', () => {
  let controller: ClientsController;
  let clientId: string;
  let dtoEmail = `test${Date.now()}@example.com`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [ClientsService, PrismaService],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a client', async () => {
    const dto: CreateClientDto = {
      email: dtoEmail,
    };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email', dtoEmail);
    clientId = result!.id;
  });

  it('should not create a client with existing email', async () => {
    const dto: CreateClientDto = {
      email: dtoEmail,
    };
    await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should create another client', async () => {
    const dto: CreateClientDto = {
      email: `another${Date.now()}@example.com`,
    };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
  });

  it('should find all clients', async () => {
    const result = await controller.findAll();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should find one client', async () => {
    const result = await controller.findOne(clientId);
    expect(result).toHaveProperty('id', clientId);
    expect(result.email).toBe(dtoEmail);
  });

  it('should not find non-existing client', async () => {
    await expect(controller.findOne('non-existing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a client', async () => {
    const newEmail = `updated${Date.now()}@example.com`;
    const dto: UpdateClientDto = {
      email: newEmail,
    };
    const result = await controller.update(clientId, dto);
    expect(result).toHaveProperty('id', clientId);
    expect(result).toHaveProperty('email', newEmail);
  });

  it('should not update to existing email', async () => {
    const existingEmail = `another${Date.now()}@example.com`;
    // Create another client first
    await controller.create({ email: existingEmail });

    const dto: UpdateClientDto = {
      email: existingEmail,
    };
    await expect(controller.update(clientId, dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should remove a client', async () => {
    const result = await controller.remove(clientId);
    expect(result).toHaveProperty('id', clientId);
  });

  it('should not remove non-existing client', async () => {
    await expect(controller.remove('non-existing-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
