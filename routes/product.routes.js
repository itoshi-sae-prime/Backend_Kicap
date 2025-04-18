const express = require("express");
const {
    getProducts,
    getProduct_keycap_bo,
    getProduct_banphimco,
    getProduct_modsphim,
    getProduct_chuot,
    getProduct_sanpham,
    getKeycapBoDetail,
    getBanphimcoDetail,
    getModsphimDetail,
    getChuotDetail,
    getSanphamDetail, } = require("../controller/product.controller");
const router = express.Router();

router.get("/v1", getProducts);
router.get("/keycap_bo", getProduct_keycap_bo);
router.get("/keycap_bo/:slug", getKeycapBoDetail);

router.get("/banphimco", getProduct_banphimco);
router.get("/banphimco/:slug", getBanphimcoDetail);

router.get("/modsphim", getProduct_modsphim);
router.get("/modsphim/:slug", getModsphimDetail);

router.get("/chuot", getProduct_chuot);
router.get("/chuot/:slug", getChuotDetail);

router.get("/sanpham/all", getProduct_sanpham);
router.get("/sanpham/all/:slug", getSanphamDetail);

module.exports = router;