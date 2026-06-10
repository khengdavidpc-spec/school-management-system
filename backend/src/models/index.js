const sequelize       = require('../config/database');
const UserModel       = require('./User');
const StudentModel    = require('./Student');
const TeacherModel    = require('./Teacher');
const AttendanceModel = require('./Attendance');

const User       = UserModel(sequelize);
const Student    = StudentModel(sequelize);
const Teacher    = TeacherModel(sequelize);
const Attendance = AttendanceModel(sequelize);

Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

module.exports = { sequelize, User, Student, Teacher, Attendance };