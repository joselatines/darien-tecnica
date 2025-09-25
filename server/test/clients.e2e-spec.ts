import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('Clients (e2e)', () => {
  let app: INestApplication<App>;
  let createdClientId: string;
  let testEmail = `test${Date.now()}@example.com`;
  const apiKey = process.env.API_KEY as string;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // Disconnect Prisma to prevent connection leaks
    const prismaService = app.get(PrismaService);
    await prismaService.$disconnect();

    await app.close();
  });

  it('/clients (GET) - should return clients array', () => {
    return request(app.getHttpServer())
      .get('/clients')
      .set('x-api-key', apiKey)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  it('/clients (POST) - should create a new client', () => {
    const createDto = {
      email: testEmail,
    };

    return request(app.getHttpServer())
      .post('/clients')
      .set('x-api-key', apiKey)
      .send(createDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(testEmail);
        createdClientId = response.body.id;
      });
  });

  it('/clients (POST) - should not create client with existing email', () => {
    const createDto = {
      email: testEmail,
    };

    return request(app.getHttpServer())
      .post('/clients')
      .set('x-api-key', apiKey)
      .send(createDto)
      .expect(400);
  });

  it('/clients (GET) - should return clients array with created client', () => {
    return request(app.getHttpServer())
      .get('/clients')
      .set('x-api-key', apiKey)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        const client = response.body.find((c: any) => c.id === createdClientId);
        expect(client).toBeDefined();
        expect(client.email).toBe(testEmail);
      });
  });

  it('/clients/:id (GET) - should return specific client', () => {
    return request(app.getHttpServer())
      .get(`/clients/${createdClientId}`)
      .set('x-api-key', apiKey)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdClientId);
        expect(response.body.email).toBe(testEmail);
      });
  });

  it('/clients/:id (GET) - should return 404 for non-existing id', () => {
    return request(app.getHttpServer())
      .get('/clients/non-existing-id')
      .set('x-api-key', apiKey)
      .expect(404);
  });

  it('/clients/:id (PATCH) - should update client', () => {
    const newEmail = `updated${Date.now()}@example.com`;
    const updateDto = {
      email: newEmail,
    };

    return request(app.getHttpServer())
      .patch(`/clients/${createdClientId}`)
      .set('x-api-key', apiKey)
      .send(updateDto)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdClientId);
        expect(response.body.email).toBe(newEmail);
      });
  });

  it('/clients/:id (PATCH) - should not update to existing email', () => {
    // First create another client
    const anotherEmail = `another${Date.now()}@example.com`;
    const anotherDto = {
      email: anotherEmail,
    };

    return request(app.getHttpServer())
      .post('/clients')
      .set('x-api-key', apiKey)
      .send(anotherDto)
      .expect(201)
      .then(() => {
        // Now try to update the first one to the same email
        const updateDto = {
          email: anotherEmail,
        };

        return request(app.getHttpServer())
          .patch(`/clients/${createdClientId}`)
          .set('x-api-key', apiKey)
          .send(updateDto)
          .expect(400);
      });
  });

  it('/clients/:id (DELETE) - should delete client', () => {
    return request(app.getHttpServer())
      .delete(`/clients/${createdClientId}`)
      .set('x-api-key', apiKey)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdClientId);
      });
  });

  it('/clients/:id (DELETE) - should return 404 for non-existing id', () => {
    return request(app.getHttpServer())
      .delete('/clients/non-existing-id')
      .set('x-api-key', apiKey)
      .expect(404);
  });
});
