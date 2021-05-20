const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("expense");
	// res.render("sip");
});
// router.route("/").get((req, res) => {
// 	res.render("sip");
// });

module.exports = router;
