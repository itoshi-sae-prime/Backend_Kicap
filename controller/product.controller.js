const slugify = require("../utils/slugify.js");
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
const getDetail = async (url) => {
    try {
        const results = await scrapeProducts(url);

        const products = results.map(product => ({
            ...product,
            slug: slugify(product.title)
        }));

        return products
    } catch (err) {
        throw new Error(err.message);
    }
};

// One product detail
const getKeycapBoDetail = async (req, res) => {
    const slug = req.params.slug;
    try {
        const results = await getDetail(url_keycap_bo);
        const products = results.map(product => ({
            ...product,
            slug: slugify(product.title),
            category: "keycap_bo",
            type: "Keycap Bộ"
        }));
        const product_detail = products.find(p => p.slug === slug);

        if (!product_detail) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }
        return res.status(200).json(product_detail);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

};
const getBanphimcoDetail = async (req, res) => {
    const slug = req.params.slug;
    try {
        const results = await getDetail(url_banphim_co);
        const products = results.map(product => ({
            ...product,
            slug: slugify(product.title),
            category: "banphimco",
            type: "Bàn Phím Cơ"
        }));
        const product_detail = products.find(p => p.slug === slug);

        if (!product_detail) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }
        return res.status(200).json(product_detail);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
const getModsphimDetail = async (req, res) => {
    const slug = req.params.slug;
    try {
        const results = await getDetail(url_mods_banphim_co);
        const products = results.map(product => ({
            ...product,
            slug: slugify(product.title),
            category: "modsphim",
            type: "Mods Phím"
        }));
        const product_detail = products.find(p => p.slug === slug);

        if (!product_detail) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }
        return res.status(200).json(product_detail);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

};
const getChuotDetail = async (req, res) => {
    const slug = req.params.slug;
    try {
        const results = await getDetail(url_chuot);
        const products = results.map(product => ({
            ...product,
            slug: slugify(product.title),
            category: "chuot",
            type: "Chuột"
        }));
        const product_detail = products.find(p => p.slug === slug);

        if (!product_detail) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }
        return res.status(200).json(product_detail);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

};
const getSanphamDetail = async (req, res) => {
    const slug = req.params.slug;
    try {
        const results = await getDetail(url_sanpham);
        const products = results.map(product => ({
            ...product,
            slug: slugify(product.title),
            category: "All",
        }));
        const product_detail = products.find(p => p.slug === slug);

        if (!product_detail) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }
        return res.status(200).json(product_detail);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

};

// List all products
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
        const new_results = results.map(product => ({
            ...product,
            category: "keycap_bo",
        }));
        resp.status(200).json(new_results);
        // resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};
const getProduct_banphimco = async (req, resp) => {
    const limit = Number(req.query.limit);
    try {
        const results = await scrapeProducts(url_banphim_co);
        const new_results = results.map(product => ({
            ...product,
            category: "banphimco",
        }));
        resp.status(200).json(new_results);
        // resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};
const getProduct_modsphim = async (req, resp) => {

    const limit = Number(req.query.limit);
    try {
        const results = await scrapeProducts(url_mods_banphim_co);
        const new_results = results.map(product => ({
            ...product,
            category: "modsphim",
        }));
        resp.status(200).json(new_results);
        // resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};
const getProduct_chuot = async (req, resp) => {
    const limit = Number(req.query.limit);
    try {
        const results = await scrapeProducts(url_chuot);
        const new_results = results.map(product => ({
            ...product,
            category: "chuot",
        }));
        resp.status(200).json(new_results);
        // resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
};
const getProduct_sanpham = async (req, resp) => {
    const limit = Number(req.query.limit);
    try {
        const results = await scrapeProducts(url_sanpham);
        const new_results = results.map(product => ({
            ...product,
            category: "all",
        }));
        resp.status(200).json(new_results);
        // resp.status(200).json(limit && limit > 0 ? results.slice(0, limit) : results);
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
    getKeycapBoDetail,
    getBanphimcoDetail,
    getModsphimDetail,
    getChuotDetail,
    getSanphamDetail,
};
// const getKeycapBoDetail = async (req, res) => {
//     const slug = req.params.slug;
//     try {
//         const results = await getDetail(url_keycap_bo);
//         const products = results.map(product => ({
//             ...product,
//             slug: slugify(product.title),
//             category: "keycap_bo",
//         }));
//         const product_detail = products.find(p => p.slug === slug);

//         if (!product_detail) {
//             return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
//         }
//         return res.status(200).json(product_detail);
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }

// };
// const getBanphimcoDetail = async (req, res) => {
//     const slug = req.params.slug;
//     try {
//         const results = await getDetail(url_banphim_co);
//         const products = results.map(product => ({
//             ...product,
//             slug: slugify(product.title),
//             category: "banphim_co",
//         }));
//         const product_detail = products.find(p => p.slug === slug);

//         if (!product_detail) {
//             return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
//         }
//         return res.status(200).json(product_detail);
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }
// };
// const getModsphimDetail = async (req, res) => {
//     const slug = req.params.slug;
//     try {
//         const results = await getDetail(url_mods_banphim_co);
//         const products = results.map(product => ({
//             ...product,
//             slug: slugify(product.title),
//             category: "mods_banphim_co",
//         }));
//         const product_detail = products.find(p => p.slug === slug);

//         if (!product_detail) {
//             return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
//         }
//         return res.status(200).json(product_detail);
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }

// };
// const getChuotDetail = async (req, res) => {
//     const slug = req.params.slug;
//     try {
//         const results = await getDetail(url_chuot);
//         const products = results.map(product => ({
//             ...product,
//             slug: slugify(product.title),
//             category: "chuot",
//         }));
//         const product_detail = products.find(p => p.slug === slug);

//         if (!product_detail) {
//             return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
//         }
//         return res.status(200).json(product_detail);
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }

// };
// const getSanphamDetail = async (req, res) => {
//     const slug = req.params.slug;
//     try {
//         const results = await getDetail(url_sanpham);
//         const products = results.map(product => ({
//             ...product,
//             slug: slugify(product.title),
//             category: "sanpham",
//         }));
//         const product_detail = products.find(p => p.slug === slug);

//         if (!product_detail) {
//             return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
//         }
//         return res.status(200).json(product_detail);
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }

// };