const router = require('express').Router()
const carCtrl = require('../controller/carCtrl')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/' , authMiddleware, carCtrl.add)
router.get('/' , carCtrl.get)
router.get('/:id' , carCtrl.getOne)
router.put('/:id' , carCtrl.update)
router.delete('/:id' , carCtrl.delete)

module.exports = router