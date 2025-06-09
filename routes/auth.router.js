const express = require("express");
const router = express.Router();
// const authKicap = require("../controller/auth.controller");
const { registerKicap, loginKicap } = require("../controller/auth.controller");
router.post("/register", registerKicap);
router.post("/login", loginKicap);
module.exports = router;