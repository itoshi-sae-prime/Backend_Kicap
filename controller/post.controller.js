const axios = require("axios");
const cheerio = require("cheerio");
const url_index = "https://kicap.vn/";
const getPost = async (req, resp) => {
    const results = [];
    const limit = Number(req.query.limit);
    try {
        axios(url_index).then((res) => {
            const html = res.data;
            const $ = cheerio.load(html);

            $(".news-items", html).each(function () {
                const images = $(this).find(".evo-article-image > img").attr("data-lazyload");
                const title = $(this).find("h3").text().trim();
                const content = $(this).find("p").text().trim();
                results.push({ images, title, content });
            });
            if (limit && limit > 0) {
                resp.status(200).json(results.slice(0, limit));
            }
            else {
                resp.status(200).json(results);
            }
        })
    }
    catch {
        resp.status(500).json(err);
    }
}
module.exports = {
    getPost
};