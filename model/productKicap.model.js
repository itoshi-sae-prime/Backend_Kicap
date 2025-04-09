const mongoose = require("mongoose");
const Product_Kicap_Schema = new mongoose.Schema({
    images: [String], // Mảng ảnh sản phẩm
    sold_out: { type: String, default: "" },
    sale_box: { type: String, default: "" },
    name: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    sale_price: { type: String, default: "" },
}, { timestamps: true });

const Product_Kicap = mongoose.model("Product", Product_Kicap_Schema);
module.exports = Product_Kicap;
