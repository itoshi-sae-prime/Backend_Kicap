const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    images: { type: [String], required: [true, "Enter Images"] }, // Mảng String
    name: { type: String, required: [true, "Enter Product"] },
    title: { type: String, required: [true, "Enter Title"] },
    price: { type: Number, required: [true, "Enter Price"] },
    sale_price: { type: Number, required: [true, "Enter SalePrice"] },
},
    {
        timestamps: true // Xóa dấu `;`
    });

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
