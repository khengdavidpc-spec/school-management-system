const { Attendance, Student } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const records = await Attendance.findAll({
      include: [{ model: Student, as: 'student', attributes: ['firstName', 'lastName'] }],
      order: [['date', 'DESC']],
    });
    res.json(records);
  } catch (err) { next(err); }
};

exports.getMine = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { email: req.user.email } });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const records = await Attendance.findAll({
      where: { studentId: student.id },
      include: [{ model: Student, as: 'student', attributes: ['firstName', 'lastName'] }],
      order: [['date', 'DESC']],
    });
    res.json(records);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const record = await Attendance.create(req.body);
    res.status(201).json(record);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    await record.update(req.body);
    res.json(record);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    await record.destroy();
    res.json({ message: 'Attendance record deleted' });
  } catch (err) { next(err); }
};
