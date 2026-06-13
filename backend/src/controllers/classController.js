const { Class, Teacher, Student } = require('../models');

const cleanClassPayload = (body) => ({
  ...body,
  teacherId: body.teacherId || null,
  capacity: body.capacity === '' || body.capacity === undefined ? 30 : Number(body.capacity),
});

exports.getAll = async (req, res, next) => {
  try {
    const classes = await Class.findAll({
      include: [
        { model: Teacher, as: 'teacher', attributes: ['firstName', 'lastName', 'subject'] },
        { model: Student, as: 'students', attributes: ['id'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(classes);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id, {
      include: [
        { model: Teacher, as: 'teacher' },
        { model: Student, as: 'students' },
      ],
    });
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    res.json(cls);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const cls = await Class.create(cleanClassPayload(req.body));
    res.status(201).json(cls);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    await cls.update(cleanClassPayload(req.body));
    res.json(cls);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    await cls.destroy();
    res.json({ message: 'Class deleted' });
  } catch (err) { next(err); }
};
