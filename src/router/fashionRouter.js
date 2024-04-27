const router = require('express').Router()
const fashionCtrl = require('../controller/fashionCtrl')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, fashionCtrl.add)
router.get('/' , fashionCtrl.get)
router.get('/:id' , fashionCtrl.getOne)
router.put('/:id' , authMiddleware, fashionCtrl.update)
router.delete('/:id' , authMiddleware, fashionCtrl.delete)

module.exports = router