const router = require('express').Router();
const auth   = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const ctrl   = require('../controllers/attendanceController');

router.get('/',auth,authorize(['admin', 'teacher']),ctrl.getAll);
router.get('/my', auth, authorize(['student']), ctrl.getMine);
router.get('/:id',    auth, ctrl.getOne);
router.post('/',      auth, authorize(['teacher', 'admin']), ctrl.create);
router.put('/:id',    auth, authorize(['teacher', 'admin']), ctrl.update);
router.delete('/:id', auth, authorize(['admin', 'teacher']), ctrl.remove);

module.exports = router;
