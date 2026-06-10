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

describe('Teachers API', () => {
  let teacherId;

  test('GET /api/teachers without token returns 401', async () => {
    const res = await request(app).get('/api/teachers');
    expect(res.status).toBe(401);
  });

  test('GET /api/teachers with token returns 200', async () => {
    const res = await request(app)
      .get('/api/teachers')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/teachers creates a teacher', async () => {
    const res = await request(app)
      .post('/api/teachers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@school.com',
        subject: 'Mathematics',
        phone: '012345678',
      });
    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe('Jane');
    teacherId = res.body.id;
  });

  test('PUT /api/teachers/:id updates a teacher', async () => {
    const res = await request(app)
      .put(`/api/teachers/${teacherId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ subject: 'Physics' });
    expect(res.status).toBe(200);
    expect(res.body.subject).toBe('Physics');
  });

  test('DELETE /api/teachers/:id deletes a teacher', async () => {
    const res = await request(app)
      .delete(`/api/teachers/${teacherId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Teacher deleted successfully');
  });
});