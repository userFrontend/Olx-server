const router = require('express').Router()
const categoryCtrl = require('../controller/categoryCtrl')

// FormData register
router.post('/' , categoryCtrl.add)
router.get('/' , categoryCtrl.get)

module.exports = router