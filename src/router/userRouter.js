const router = require('express').Router()
const userCtrl = require('../controller/userCtrl')
const authMiddleware = require('../middleware/authMiddleware')

// FormData register
router.get('/' , authMiddleware, userCtrl.getUser)
router.put('/:id' , authMiddleware, userCtrl.update)
router.delete('/:id' , authMiddleware, userCtrl.deleteUser)

module.exports = router