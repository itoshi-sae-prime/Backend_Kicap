const express = require('express');
const { getUser, getOrderById, updatePassword, updateInformation, createAddress, getAddress, deleteAddress } = require('../controller/user.controller');
const VerifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get('/mes', VerifyToken, getUser);
router.get('/order/email', VerifyToken, getOrderById);
router.post('/change_password', VerifyToken, updatePassword);
router.post('/update_user', VerifyToken, updateInformation);
router.post('/update_address', VerifyToken, createAddress);
router.get('/mes/address', VerifyToken, getAddress);
router.delete('/mes/delete/address/:id', VerifyToken, deleteAddress);
module.exports = router;