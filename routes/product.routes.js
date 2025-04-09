const express = require("express");
const {
    getProducts,
    getProduct_keycap_bo,
    getProduct_banphimco,
    getProduct_modsphim,
    getProduct_chuot,
    getProduct_sanpham } = require("../controller/product.controller");
const router = express.Router();

router.get("/v1", getProducts);
router.get("/keycap_bo", getProduct_keycap_bo);
router.get("/banphimco", getProduct_banphimco);
router.get("/modsphim", getProduct_modsphim);
router.get("/chuot", getProduct_chuot);
router.get("/sanpham/all", getProduct_sanpham);

module.exports = router;