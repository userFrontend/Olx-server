const router = require('express').Router()
const userCtrl = require('../controller/userCtrl')

// FormData register
router.get('/' , userCtrl.getUser)
router.put('/:id' , userCtrl.update)
router.delete('/:id' , userCtrl.deleteUser)

module.exports = router