const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Admin', email: 'admin@school.com', password: 'admin123', role: 'admin' });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@school.com', password: 'admin123' });
  token = res.body.token;
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

describe('Students API', () => {
  let studentId;

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
      .send({ firstName: 'John', lastName: 'Doe', email: 'john@student.com', grade: '10A' });
    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe('John');
    studentId = res.body.id;
  });

  test('PUT /api/students/:id updates a student', async () => {
    const res = await request(app)
      .put(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ grade: '11A' });
    expect(res.status).toBe(200);
    expect(res.body.grade).toBe('11A');
  });

  test('DELETE /api/students/:id deletes a student', async () => {
    const res = await request(app)
      .delete(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});