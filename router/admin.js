const express = require('express')
const router = express.Router();
const {createFaq,updateFaq,deleteFaq} = require('../controller/adminFaqController')
const verifyAdmin = require("../middleware/adminAuth.js")

router.post('/faq',verifyAdmin,createFaq)
router.patch('/faq/:id',verifyAdmin,updateFaq)
router.delete('/faq/:id',verifyAdmin,deleteFaq)

module.exports = router;