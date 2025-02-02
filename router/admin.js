const express = require('express')
const router = express.Router();
const {createFaq,updateFaq,deleteFaq} = require('../controller/adminFaqController')
const verifyAdmin = require("../middleware/adminAuth.js")

router.post('/createfaq',verifyAdmin,createFaq)
router.patch('/updatefaq/:id',verifyAdmin,updateFaq)
router.delete('/deletefaq/:id',verifyAdmin,deleteFaq)

module.exports = router;