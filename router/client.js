const express = require('express')
const router = express.Router();
const {fetchAllFaq, fetchSpecific} = require("../controller/clientFaqController")

router.get("/fetchall",fetchAllFaq)
router.get("/:id", fetchSpecific)

module.exports = router;3