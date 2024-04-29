const router = require('express').Router()
const categoryCtrl = require('../controller/categoryCtrl')
const authMiddleware = require('../middleware/authMiddleware')

// FormData register
router.post('/' , authMiddleware ,categoryCtrl.add)
router.get('/' , categoryCtrl.get)
router.put('/:id' , authMiddleware, categoryCtrl.update)
router.delete('/:id' , authMiddleware, categoryCtrl.delete)

module.exports = router