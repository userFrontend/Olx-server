const router = require('express').Router()
const carCtrl = require('../controller/carCtrl')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/car/' , authMiddleware, carCtrl.add)
router.get('/car/' , carCtrl.get)
router.get('/car/:id' , carCtrl.getOne)
router.put('/car/:id' , authMiddleware, carCtrl.update)
router.delete('/car/:id' , authMiddleware, carCtrl.delete)
router.get('/cars/similar', carCtrl.similar)

module.exports = router