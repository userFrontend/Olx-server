const router = require('express').Router()
const workCtrl = require('../controller/workCtrl')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/work/', authMiddleware, workCtrl.add)
router.get('/work/' , workCtrl.get)
router.get('/work/:id' , workCtrl.getOne)
router.put('/work/:id' , workCtrl.update)
router.delete('/work/:id' , workCtrl.delete)
router.get('/works/similar' , authMiddleware, workCtrl.similar)

module.exports = router