const router = require('express').Router()
const fashionCtrl = require('../controller/fashionCtrl')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/fashion/', authMiddleware, fashionCtrl.add)
router.get('/fashion/' , fashionCtrl.get)
router.get('/fashion/:id' , fashionCtrl.getOne)
router.put('/fashion/:id' , authMiddleware, fashionCtrl.update)
router.delete('/fashion/:id' , authMiddleware, fashionCtrl.delete)
router.get('/fashions/similar' , authMiddleware, fashionCtrl.similar)

module.exports = router