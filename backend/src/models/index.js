const sequelize        = require('../config/database');
const UserModel        = require('./User');
const StudentModel     = require('./Student');
const TeacherModel     = require('./Teacher');
const AttendanceModel  = require('./Attendance');
const ClassModel       = require('./Class');

const User       = UserModel(sequelize);
const Student    = StudentModel(sequelize);
const Teacher    = TeacherModel(sequelize);
const Attendance = AttendanceModel(sequelize);
const Class      = ClassModel(sequelize);

// Relationships
Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Teacher.hasMany(Class, { foreignKey: 'teacherId', as: 'classes' });
Class.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });

module.exports = { sequelize, User, Student, Teacher, Attendance, Class };