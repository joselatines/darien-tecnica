import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Espacios (e2e)', () => {
  let app: INestApplication<App>;
  let createdEspacioId: string;
  let testName = `Test Espacio ${Date.now()}`;
  const apiKey = process.env.API_KEY as string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/espacios (GET) - should return espacios array', () => {
    return request(app.getHttpServer())
      .get('/espacios')
      .set('x-api-key', apiKey)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  it('/espacios (POST) - should create a new espacio', () => {
    const createDto = {
      name: testName,
      location: 'Caracas',
      capacity: 10,
      description: 'Test espacio',
    };

    return request(app.getHttpServer())
      .post('/espacios')
      .set('x-api-key', apiKey)
      .send(createDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(testName);
        expect(response.body.location).toBe('Caracas');
        expect(response.body.capacity).toBe(10);
        createdEspacioId = response.body.id;
      });
  });

  it('/espacios (POST) - should not create espacio with existing name', () => {
    const createDto = {
      name: testName,
      location: 'Caracas',
      capacity: 20,
    };

    return request(app.getHttpServer())
      .post('/espacios')
      .set('x-api-key', apiKey)
      .send(createDto)
      .expect(400);
  });

  it('/espacios (GET) - should return espacios array', () => {
    return request(app.getHttpServer())
      .get('/espacios')
      .set('x-api-key', apiKey)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        const espacio = response.body.find((e: any) => e.id === createdEspacioId);
        expect(espacio).toBeDefined();
        expect(espacio.name).toBe(testName);
      });
  });

  it('/espacios/:id (GET) - should return specific espacio', () => {
    return request(app.getHttpServer())
      .get(`/espacios/${createdEspacioId}`)
      .set('x-api-key', apiKey)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdEspacioId);
        expect(response.body.name).toBe(testName);
      });
  });

  it('/espacios/:id (GET) - should return 404 for non-existing id', () => {
    return request(app.getHttpServer())
      .get('/espacios/non-existing-id')
      .set('x-api-key', apiKey)
      .expect(404);
  });

  it('/espacios/:id (PATCH) - should update espacio', () => {
    const updateDto = {
      capacity: 15,
      description: 'Updated description',
    };

    return request(app.getHttpServer())
      .patch(`/espacios/${createdEspacioId}`)
      .set('x-api-key', apiKey)
      .send(updateDto)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdEspacioId);
        expect(response.body.capacity).toBe(15);
        expect(response.body.description).toBe('Updated description');
      });
  });

  it('/espacios/:id (PATCH) - should not update to existing name', () => {
    // First create another espacio
    const anotherDto = {
      name: `${testName} Another`,
      location: 'Caracas',
      capacity: 5,
    };

    return request(app.getHttpServer())
      .post('/espacios')
      .set('x-api-key', apiKey)
      .send(anotherDto)
      .expect(201)
      .then(() => {
        // Now try to update the first one to the same name
        const updateDto = {
          name: `${testName} Another`,
        };

        return request(app.getHttpServer())
          .patch(`/espacios/${createdEspacioId}`)
          .set('x-api-key', apiKey)
          .send(updateDto)
          .expect(400);
      });
  });

  it('/espacios/:id (DELETE) - should delete espacio', () => {
    return request(app.getHttpServer())
      .delete(`/espacios/${createdEspacioId}`)
      .set('x-api-key', apiKey)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdEspacioId);
      });
  });

  it('/espacios/:id (DELETE) - should return 404 for non-existing id', () => {
    return request(app.getHttpServer())
      .delete('/espacios/non-existing-id')
      .set('x-api-key', apiKey)
      .expect(404);
  });
});
