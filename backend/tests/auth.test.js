const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  test('POST /api/auth/register creates a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin', email: 'admin@school.com', password: 'admin123', role: 'admin' });
    expect(res.status).toBe(201);
  });

  test('POST /api/auth/register duplicate email returns 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin', email: 'admin@school.com', password: 'admin123', role: 'admin' });
    expect(res.status).toBe(409);
  });

  test('POST /api/auth/login returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@school.com', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login wrong password returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@school.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/login unknown email returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@school.com', password: 'admin123' });
    expect(res.status).toBe(401);
  });
});