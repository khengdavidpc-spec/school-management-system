const router = require('express').Router();
const auth   = require('../middleware/auth');
const role   = require('../middleware/role');
const { register, login, me, updateUser, deleteUser } = require('../controllers/authController');
const { User } = require('../models');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        auth, me);
router.get('/users',     auth, role('admin'), async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (err) { next(err); }
});
router.put('/users/:id',    auth, role('admin'), updateUser);
router.delete('/users/:id', auth, role('admin'), deleteUser);

module.exports = router;
