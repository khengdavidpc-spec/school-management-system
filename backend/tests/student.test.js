const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Health Check', () => {
  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth API', () => {
  test('POST /api/auth/register creates a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@school.com',
        password: 'admin123',
        role: 'admin',
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered');
  });

  test('POST /api/auth/login returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@school.com', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login with wrong password returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@school.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });
});

describe('Students API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@school.com', password: 'admin123' });
    token = res.body.token;
  });

  test('GET /api/students without token returns 401', async () => {
    const res = await request(app).get('/api/students');
    expect(res.status).toBe(401);
  });

  test('GET /api/students with token returns 200', async () => {
    const res = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/students creates a student', async () => {
    const res = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@student.com',
        grade: '10A',
      });
    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe('John');
  });
});