const { Teacher } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const teachers = await Teacher.findAll({ order: [['createdAt', 'DESC']] });
    res.json(teachers);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    await teacher.update(req.body);
    res.json(teacher);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    await teacher.destroy();
    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) { next(err); }
};