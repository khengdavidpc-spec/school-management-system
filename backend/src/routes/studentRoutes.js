const router = require('express').Router();
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const ctrl = require('../controllers/studentController');

router.get('/', auth, authorize(['admin', 'teacher']), ctrl.getAll);

router.get('/me', auth, authorize(['student']), ctrl.getMine);

router.get('/:id', auth, ctrl.getOne);

router.post('/', auth, authorize(['admin']), ctrl.create);

router.put('/:id', auth, authorize(['admin']), ctrl.update);

router.delete('/:id', auth, authorize(['admin']), ctrl.remove);

module.exports = router;
