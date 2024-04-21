const router = require('express').Router()
const carCtrl = require('../controller/carCtrl')

router.post('/' , carCtrl.add)
router.get('/' , carCtrl.get)
router.get('/:id' , carCtrl.getOne)

module.exports = router