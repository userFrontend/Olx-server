const router = require('express').Router()
const typeCtrl = require('../controller/typeCtrl')
const authMiddleware = require('../middleware/authMiddleware')

// FormData register
router.post('/', authMiddleware, typeCtrl.add)
router.get('/' , typeCtrl.get)

module.exports = router