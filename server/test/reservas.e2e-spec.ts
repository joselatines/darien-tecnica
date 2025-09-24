import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Reservas (e2e)', () => {
  let app: INestApplication<App>;
  let createdReservaId: string;
  let testEspacioId: string;
  let testClientId: string;
  const testDate = '2025-01-01';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create test espacio
    const espacioResponse = await request(app.getHttpServer())
      .post('/espacios')
      .send({
        name: `Test Espacio ${Date.now()}`,
        location: 'Caracas',
        capacity: 10,
        description: 'Test espacio for reservas',
      })
      .expect(201);
    testEspacioId = espacioResponse.body.id;

    // Create test client
    const clientResponse = await request(app.getHttpServer())
      .post('/clients')
      .send({
        email: `test${Date.now()}@example.com`,
      })
      .expect(201);
    testClientId = clientResponse.body.id;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/reservas (GET) - should return reservas array', () => {
    return request(app.getHttpServer())
      .get('/reservas')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
      });
  });

  it('/reservas (POST) - should create a new reserva', () => {
    const createDto = {
      espacioId: testEspacioId,
      clientId: testClientId,
      reservationDate: testDate,
      startTime: '10:00',
      endTime: '11:00',
      status: 'confirmed',
    };

    return request(app.getHttpServer())
      .post('/reservas')
      .send(createDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.espacioId).toBe(testEspacioId);
        expect(response.body.clientId).toBe(testClientId);
        createdReservaId = response.body.id;
      });
  });

  it('/reservas (POST) - should not create reserva exceeding max reservations per week', async () => {
    // Create 3 reservations for the client in the same week
    for (let i = 0; i < 3; i++) {
      const createDto = {
        espacioId: testEspacioId,
        clientId: testClientId,
        reservationDate: `2025-01-0${i + 1}`,
        startTime: '10:00',
        endTime: '11:00',
        status: 'confirmed',
      };
      await request(app.getHttpServer())
        .post('/reservas')
        .send(createDto)
        .expect(201);
    }

    // Try to create one more in the same week
    const createDto = {
      espacioId: testEspacioId,
      clientId: testClientId,
      reservationDate: '2025-01-04',
      startTime: '10:00',
      endTime: '11:00',
      status: 'confirmed',
    };

    return request(app.getHttpServer())
      .post('/reservas')
      .send(createDto)
      .expect(400);
  });

  it('/reservas (POST) - should not create reserva with time conflict', async () => {
    // Create first reserva
    const createDto1 = {
      espacioId: testEspacioId,
      clientId: testClientId,
      reservationDate: testDate,
      startTime: '10:00',
      endTime: '12:00',
      status: 'confirmed',
    };
    await request(app.getHttpServer())
      .post('/reservas')
      .send(createDto1)
      .expect(201);

    // Try to create overlapping reserva
    const createDto2 = {
      espacioId: testEspacioId,
      clientId: testClientId,
      reservationDate: testDate,
      startTime: '11:00',
      endTime: '13:00',
      status: 'confirmed',
    };

    return request(app.getHttpServer())
      .post('/reservas')
      .send(createDto2)
      .expect(400);
  });

  it('/reservas/:id (GET) - should return specific reserva', () => {
    return request(app.getHttpServer())
      .get(`/reservas/${createdReservaId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdReservaId);
      });
  });

  it('/reservas/:id (GET) - should return 404 for non-existing id', () => {
    return request(app.getHttpServer())
      .get('/reservas/non-existing-id')
      .expect(404);
  });

  it('/reservas/:id (PATCH) - should update reserva', () => {
    const updateDto = {
      status: 'pending',
    };

    return request(app.getHttpServer())
      .patch(`/reservas/${createdReservaId}`)
      .send(updateDto)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdReservaId);
        expect(response.body.status).toBe('pending');
      });
  });

  it('/reservas/:id (PATCH) - should update same reserva with time conflict', async () => {
    // Create another reserva on same day
    const createDto = {
      espacioId: testEspacioId,
      clientId: testClientId,
      reservationDate: testDate,
      startTime: '14:00',
      endTime: '15:00',
      status: 'confirmed',
    };
    await request(app.getHttpServer())
      .post('/reservas')
      .send(createDto)
      .expect(201);

    // Try to update first reserva to overlap
    const updateDto = {
      reservationDate: testDate,
      startTime: '12:00',
      endTime: '15:00',
    };

    return request(app.getHttpServer())
      .patch(`/reservas/${createdReservaId}`)
      .send(updateDto)
      .expect(200);
  });

  it('/reservas/:id (DELETE) - should delete reserva', () => {
    return request(app.getHttpServer())
      .delete(`/reservas/${createdReservaId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdReservaId);
      });
  });

  it('/reservas/:id (DELETE) - should return 404 for non-existing id', () => {
    return request(app.getHttpServer())
      .delete('/reservas/non-existing-id')
      .expect(404);
  });
});
