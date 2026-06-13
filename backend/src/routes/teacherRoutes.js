const router = require('express').Router();
const auth   = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const ctrl   = require('../controllers/teacherController');

router.get('/',       auth, ctrl.getAll);
router.get('/:id',    auth, ctrl.getOne);
router.post('/',      auth, authorize(['admin']), ctrl.create);
router.put('/:id',    auth, ctrl.update);
router.delete('/:id', auth, authorize(['admin']), ctrl.remove);

module.exports = router;