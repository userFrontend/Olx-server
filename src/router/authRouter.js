const router = require('express').Router()
const authCtrl = require('../controller/authCtrl')

// FormData register
router.post('/login' , authCtrl.login)
router.post('/signup' , authCtrl.signup)
router.post('/googleAuth' , authCtrl.googleAuth)

module.exports = router