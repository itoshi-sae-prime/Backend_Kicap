const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const Product = require("./model/product.model");
const productRouter = require('./routes/product.routes');
const postRouter = require('./routes/post.router');
const postOrderRouter = require('./routes/order.router');
const connectDB = require("./config/db");
require('dotenv').config();

const app = express();

// Kết nối database
connectDB();
app.use(express.json());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParse.json({ limit: "50mb" }));
app.use(bodyParse.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
}));

// CORS cấu hình chi tiết hơn
const corsOptions = {
    origin: 'https://frontend-kicap.vercel.app', // Chỉ cho phép origin này
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức được phép
    credentials: true, // Cho phép cookie và header ủy quyền
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
};
app.use(cors(corsOptions));

// Routes
app.use('/api/products', productRouter);
app.use('/api/posts', postRouter);
app.use('/api/orders', postOrderRouter);

// Các route cũ (đã được chuyển sang router, nên không cần ở đây nữa)
// app.get("/api/product", async (req, resp) => { ... });
// app.get("/api/product/:id", async (req, resp) => { ... });
// app.post("/api/product", async (req, resp) => { ... });

const port = process.env.PORT || 8000; // Sử dụng process.env.PORT cho môi trường deploy
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});