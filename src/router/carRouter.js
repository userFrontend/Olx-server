const router = require('express').Router()
const carCtrl = require('../controller/carCtrl')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/' , authMiddleware, carCtrl.add)
router.get('/' , carCtrl.get)
router.get('/:id' , carCtrl.getOne)
router.put('/:id' , authMiddleware, carCtrl.update)
router.delete('/:id' , authMiddleware, carCtrl.delete)
router.get('/similar' , authMiddleware, carCtrl.similar)

module.exports = router