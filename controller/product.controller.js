const axios = require("axios");
const cheerio = require("cheerio");
const url_index = "https://kicap.vn/";
const url_keycap_bo = "https://kicap.vn/keycap-bo";
const url_banphim_co = "https://kicap.vn/ban-phim-co";
const url_mods_banphim_co = "https://kicap.vn/mods-ban-phim-co";
const url_chuot = "https://kicap.vn/chuot";
const url_sanpham = "https://kicap.vn/collections/all"

const scrapeProducts = async (url) => {
    const results = [];
    try {
        const res = await axios.get(url);
        const html = res.data;
        const $ = cheerio.load(html);

        $(".product-card", html).each(function () {
            const images = $(this).find(".product-card__image > picture > source")
                .map((i, el) => $(el).attr("srcset"))
                .get();
            const sold_out = $(this).find(".product-card__image > span.soldout").text().trim();
            const sale_box = $(this).find(".sale-box").text().trim();
            const name = $(this).find("h4.product-single__series").text().trim();
            const title = $(this).find("h3.product-card__title").text().trim();
            const price = $(this).find(".product-price > strong").text().trim();
            const sale_price = $(this).find(".product-price > span").text().trim();

            results.push({ images, sold_out, sale_box, name, title, price, sale_price });
        });

        return results;
    } catch (err) {
        throw new Error(err.message);
    }
};
const getProducts = async (req, resp) => {
    const limit = Number(req.query.limit);
    try {
        const results = await scrapeProducts(url_index);
        resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};
const getProduct_keycap_bo = async (req, resp) => {
    const limit = Number(req.query.limit);
    try {
        const results = await scrapeProducts(url_keycap_bo);
        resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};
const getProduct_banphimco = async (req, resp) => {
    const limit = Number(req.query.limit);
    try {
        const results = await scrapeProducts(url_banphim_co);
        resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};
const getProduct_modsphim = async (req, resp) => {

    const limit = Number(req.query.limit);
    try {
        const results = await scrapeProducts(url_mods_banphim_co);
        resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};
const getProduct_chuot = async (req, resp) => {
    const limit = Number(req.query.limit);
    try {
        const results = await scrapeProducts(url_chuot);
        resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};
const getProduct_sanpham = async (req, resp) => {
    const limit = Number(req.query.limit);
    try {
        const results = await scrapeProducts(url_sanpham);
        resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};
module.exports = {
    getProducts,
    getProduct_keycap_bo,
    getProduct_banphimco,
    getProduct_modsphim,
    getProduct_chuot,
    getProduct_sanpham,
};
