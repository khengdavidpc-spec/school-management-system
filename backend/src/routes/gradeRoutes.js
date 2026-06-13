const router = require('express').Router();
const auth   = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const ctrl   = require('../controllers/gradeController');

router.get('/',                        auth, authorize(['admin', 'teacher']), ctrl.getAll);
router.get('/my',                      auth, authorize(['student']), ctrl.getMine);
router.get('/student/:studentId',      auth, authorize(['admin', 'teacher']), ctrl.getByStudent);
router.post('/',                       auth, authorize(['admin', 'teacher']), ctrl.create);
router.put('/:id',                     auth, authorize(['admin', 'teacher']), ctrl.update);
router.delete('/:id',                  auth, authorize(['admin', 'teacher']), ctrl.remove);

module.exports = router;
