const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ name, email, password: hashed, role: role || 'student' });
    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password, role } = req.body;
    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(409).json({ message: 'Email already registered' });
    }

    if (user.id === req.user.id && role && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot remove your own admin role' });
    }

    const changes = {};
    if (name !== undefined) changes.name = name;
    if (email !== undefined) changes.email = email;
    if (role !== undefined) changes.role = role;
    if (password) changes.password = await bcrypt.hash(password, 12);

    await user.update(changes);
    const safeUser = user.toJSON();
    delete safeUser.password;
    res.json(safeUser);
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.id === req.user.id) return res.status(400).json({ message: 'You cannot delete your own account' });

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
};
