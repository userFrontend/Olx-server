const router = require('express').Router()
const typeCtrl = require('../controller/typeCtrl')

// FormData register
router.post('/' , typeCtrl.add)
router.get('/' , typeCtrl.get)

module.exports = router