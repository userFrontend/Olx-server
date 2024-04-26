const router = require('express').Router()
const subCtrl = require('../controller/subCtrl')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, subCtrl.add)
router.get('/', subCtrl.get)

module.exports = router