const router = require('express').Router()
const workCtrl = require('../controller/workCtrl')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, workCtrl.add)
router.get('/' , workCtrl.get)
router.get('/:id' , workCtrl.getOne)
router.put('/:id' , workCtrl.update)
router.delete('/:id' , workCtrl.delete)

module.exports = router