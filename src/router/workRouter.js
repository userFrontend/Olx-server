const router = require('express').Router()
const workCtrl = require('../controller/workCtrl')

router.post('/' , workCtrl.add)
router.get('/' , workCtrl.get)
router.get('/:id' , workCtrl.getOne)

module.exports = router