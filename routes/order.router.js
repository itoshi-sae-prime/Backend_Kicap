const express = require("express");
const router = express.Router();
const {
    orderKicap, EvaluateKicap, } = require('../controller/order.controller');
const validateOrder = require('../middleware/validateOrder');
// router.post('/orderKicap', orderKicap);
router.post('/orderKicap', validateOrder, orderKicap);
router.post('/sendEvalute', EvaluateKicap);
module.exports = router;