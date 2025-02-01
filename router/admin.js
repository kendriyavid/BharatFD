
const express = require('express')
const router = express.Router();
const {createFaq,updateFaq,deleteFaq} = require('../controller/adminFaqController')

router.post('/createfaq',createFaq)
router.patch('/updatefaq/:id',updateFaq)
router.delete('/deletefaq/:id',deleteFaq)

module.exports = router;