const { Student } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const students = await Student.findAll({ order: [['createdAt', 'DESC']] });
    res.json(students);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.update(req.body);
    res.json(student);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (err) { next(err); }
};