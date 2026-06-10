const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

let token;
let studentId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Admin', email: 'admin@school.com', password: 'admin123', role: 'admin' });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@school.com', password: 'admin123' });
  token = res.body.token;

  const student = await request(app)
    .post('/api/students')
    .set('Authorization', `Bearer ${token}`)
    .send({
      firstName: 'Test',
      lastName: 'Student',
      email: 'test@student.com',
      grade: '10A',
    });
  studentId = student.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Attendance API', () => {
  let attendanceId;

  test('GET /api/attendance without token returns 401', async () => {
    const res = await request(app).get('/api/attendance');
    expect(res.status).toBe(401);
  });

  test('GET /api/attendance with token returns 200', async () => {
    const res = await request(app)
      .get('/api/attendance')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/attendance creates a record', async () => {
    const res = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId,
        date: '2026-06-10',
        status: 'present',
        notes: 'On time',
      });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('present');
    attendanceId = res.body.id;
  });

  test('PUT /api/attendance/:id updates a record', async () => {
    const res = await request(app)
      .put(`/api/attendance/${attendanceId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'late' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('late');
  });

  test('DELETE /api/attendance/:id deletes a record', async () => {
    const res = await request(app)
      .delete(`/api/attendance/${attendanceId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});