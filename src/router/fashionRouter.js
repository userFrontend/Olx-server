const router = require('express').Router()
const fashionCtrl = require('../controller/fashionCtrl')

router.post('/' , fashionCtrl.add)
router.get('/' , fashionCtrl.get)
router.get('/:id' , fashionCtrl.getOne)

module.exports = router