const { Student, Class } = require('../models');

const cleanStudentPayload = async (body) => {
  const payload = {
    ...body,
    classId: body.classId || null,
  };

  if (payload.classId && !payload.grade) {
    const cls = await Class.findByPk(payload.classId);
    if (cls) payload.grade = cls.grade;
  }

  return payload;
};

exports.getAll = async (req, res, next) => {
  try {
    const students = await Student.findAll({ order: [['createdAt', 'DESC']] });
    res.json(students);
  } catch (err) { next(err); }
};

exports.getMine = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { email: req.user.email } });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json(student);
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
    const existing = await Student.findOne({ where: { email: req.body.email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const student = await Student.create(await cleanStudentPayload(req.body));
    res.status(201).json(student);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (req.body.email && req.body.email !== student.email) {
      const existing = await Student.findOne({ where: { email: req.body.email } });
      if (existing) return res.status(409).json({ message: 'Email already registered' });
    }

    await student.update(await cleanStudentPayload(req.body));
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
