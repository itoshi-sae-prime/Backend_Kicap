const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const Product = require("./model/product.model");
const productRouter = require('./routes/product.routes')
const postRouter = require('./routes/post.router');
const postOrderRouter = require('./routes/order.router');
require('dotenv').config();
const app = express();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://admin123:050825%21%40%23%24Tt@kicapdb.sxbgl.mongodb.net/?retryWrites=true&w=majority&appName=KicapDb")
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối:", err));;

app.use(bodyParse.json({ limit: "50mb" }));
app.use(cors({
    origin: 'https://frontend-kicap.vercel.app', // hoặc '*' nếu muốn mở cho tất cả
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(
    bodyParse.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);

app.use('/api/products', productRouter);
app.use('/api/posts', postRouter);
app.use('/api/orders', postOrderRouter);

// app.get("/post", (req, resp) => {

// });
// app.get("/api/product", async (req, resp) => {
//     try {
//         const products = await Product.find();
//         resp.status(200).json(products);
//     } catch (err) {
//         resp.status(500).json(err);
//     }
// });
// app.get("/api/product/:id", async (req, resp) => {
//     const { id } = req.params;
//     try {
//         const product = await Product.findById(id);
//         resp.status(200).json(product);
//     } catch (err) {
//         resp.status(500).json(err);
//     }
// });

///DB
// app.post("/api/product", async (req, resp) => {
//     try {
//         const product = await Product.create(req.body);
//         return resp.status(201).json(product);
//     } catch (err) {
//         return resp.status(500).json(err);
//     }
//     return resp.status(200).json(req.body);
// });
const port = 8000;
app.listen(8000, () => {
    console.log(`Server is running on ${port}`);
})




