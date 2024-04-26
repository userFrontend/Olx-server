const router = require('express').Router()
const workCtrl = require('../controller/workCtrl')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, workCtrl.add)
router.get('/' , workCtrl.get)
router.get('/:id' , workCtrl.getOne)

module.exports = router