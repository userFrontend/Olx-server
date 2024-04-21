const router = require('express').Router()
const subCtrl = require('../controller/subCtrl')

router.post('/' , subCtrl.add)
router.get('/' , subCtrl.get)

module.exports = router