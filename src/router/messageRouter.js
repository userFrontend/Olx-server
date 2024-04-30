const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware');
const messageCtrl = require('../controller/messageCtrl');


router.post('/', authMiddleware, messageCtrl.addMessage);
router.get('/:chatId', authMiddleware, messageCtrl.getMessage);
router.put('/:messageId' , messageCtrl.updateMessage);
router.delete('/:messageId', authMiddleware, messageCtrl.deleteMessage);

module.exports = router