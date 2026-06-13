const sequelize       = require('../config/database');
const UserModel       = require('./User');
const StudentModel    = require('./Student');
const TeacherModel    = require('./Teacher');
const AttendanceModel = require('./Attendance');
const ClassModel      = require('./Class');
const GradeModel      = require('./grade');

const User       = UserModel(sequelize);
const Student    = StudentModel(sequelize);
const Teacher    = TeacherModel(sequelize);
const Attendance = AttendanceModel(sequelize);
const Class      = ClassModel(sequelize);
const Grade      = GradeModel(sequelize);

Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Teacher.hasMany(Class, { foreignKey: 'teacherId', as: 'classes' });
Class.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });
Student.hasMany(Grade, { foreignKey: 'studentId', as: 'grades' });
Grade.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Class.hasMany(Grade, { foreignKey: 'classId', as: 'grades' });

module.exports = { sequelize, User, Student, Teacher, Attendance, Class, Grade };
