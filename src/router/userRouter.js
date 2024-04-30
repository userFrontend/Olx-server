const router = require('express').Router()
const userCtrl = require('../controller/userCtrl')
const authMiddleware = require('../middleware/authMiddleware')

// FormData register
router.get('/' , userCtrl.getAllUsers)
router.get('/:id' , userCtrl.getUser)
router.put('/:id' , authMiddleware, userCtrl.update)
router.delete('/:id' , authMiddleware, userCtrl.deleteUser)
router.put('/like/:id' , authMiddleware, userCtrl.like)

module.exports = router