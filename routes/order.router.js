const express = require("express");
const {
    orderKicap } = require('../controller/order.controller')
const router = express.Router();

router.post('/orderKicap', orderKicap);

module.exports = router;