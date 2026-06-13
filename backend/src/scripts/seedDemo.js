const bcrypt = require('bcryptjs');
const { sequelize, User, Teacher, Student, Class } = require('../models');

const users = [
  { name: 'Admin', email: 'admin@school.com', password: 'admin123', role: 'admin' },
  { name: 'Teacher', email: 'teacher@school.com', password: 'teacher123', role: 'teacher' },
  { name: 'Student', email: 'student@school.com', password: 'student123', role: 'student' },
];

const upsertUser = async ({ name, email, password, role }) => {
  const hashed = await bcrypt.hash(password, 12);
  const [user] = await User.findOrCreate({
    where: { email },
    defaults: { name, email, password: hashed, role },
  });

  await user.update({ name, role, password: hashed });
  return user;
};

const run = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  await Promise.all(users.map(upsertUser));

  const [teacher] = await Teacher.findOrCreate({
    where: { email: 'teacher@school.com' },
    defaults: {
      firstName: 'Demo',
      lastName: 'Teacher',
      email: 'teacher@school.com',
      phone: '010000001',
      subject: 'Math',
      status: 'active',
      sex: 'Other',
    },
  });
  await teacher.update({ firstName: 'Demo', lastName: 'Teacher', subject: 'Math', status: 'active' });

  const [schoolClass] = await Class.findOrCreate({
    where: { name: 'Grade 10A' },
    defaults: {
      name: 'Grade 10A',
      grade: '10A',
      subject: 'Math',
      teacherId: teacher.id,
      capacity: 30,
    },
  });
  await schoolClass.update({ grade: '10A', subject: 'Math', teacherId: teacher.id });

  const [student] = await Student.findOrCreate({
    where: { email: 'student@school.com' },
    defaults: {
      firstName: 'Demo',
      lastName: 'Student',
      email: 'student@school.com',
      phone: '010000002',
      grade: '10A',
      classId: schoolClass.id,
      status: 'active',
      sex: 'Other',
    },
  });
  await student.update({
    firstName: 'Demo',
    lastName: 'Student',
    grade: '10A',
    classId: schoolClass.id,
    status: 'active',
  });

  console.log('Demo data ready: admin@school.com, teacher@school.com, student@school.com');
};

run()
  .catch((err) => {
    console.error('Failed to seed demo data:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
