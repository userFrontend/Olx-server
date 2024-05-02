const router = require('express').Router()
const typeCtrl = require('../controller/typeCtrl')
const authMiddleware = require('../middleware/authMiddleware')

// FormData register
router.post('/', authMiddleware, typeCtrl.add)
router.get('/' , typeCtrl.get)
router.put('/:id' , authMiddleware, typeCtrl.update)
router.delete('/:id' , authMiddleware, typeCtrl.delete)

module.exports = router