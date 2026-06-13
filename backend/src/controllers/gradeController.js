const { Grade, Student, Class } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const grades = await Grade.findAll({
      include: [
        { model: Student, as: 'student', attributes: ['firstName', 'lastName'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(grades);
  } catch (err) { next(err); }
};

exports.getMine = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { email: req.user.email } });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const grades = await Grade.findAll({
      where: { studentId: student.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(grades);
  } catch (err) { next(err); }
};

exports.getByStudent = async (req, res, next) => {
  try {
    const grades = await Grade.findAll({
      where: { studentId: req.params.studentId },
      order: [['createdAt', 'DESC']],
    });
    res.json(grades);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { score, studentId } = req.body;
    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let grade = 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    const g = await Grade.create({ ...req.body, classId: req.body.classId || student.classId, grade });
    res.status(201).json(g);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const g = await Grade.findByPk(req.params.id);
    if (!g) return res.status(404).json({ message: 'Grade not found' });
    const { score } = req.body;
    let grade = g.grade;
    if (score !== undefined) {
      if (score >= 90) grade = 'A';
      else if (score >= 80) grade = 'B';
      else if (score >= 70) grade = 'C';
      else if (score >= 60) grade = 'D';
      else grade = 'F';
    }
    await g.update({ ...req.body, grade });
    res.json(g);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const g = await Grade.findByPk(req.params.id);
    if (!g) return res.status(404).json({ message: 'Grade not found' });
    await g.destroy();
    res.json({ message: 'Grade deleted' });
  } catch (err) { next(err); }
};
