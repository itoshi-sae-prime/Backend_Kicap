const express = require("express");
const router = express.Router();
const {
    orderKicap, EvaluateKicap } = require('../controller/order.controller')


router.post('/orderKicap', orderKicap);
router.post('/sendEvalute', EvaluateKicap);

module.exports = router;