const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("sip");
});

module.exports = router;
