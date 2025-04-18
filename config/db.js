// config/db.js
const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            console.error("❌ MONGODB_URI chưa được định nghĩa trong file .env");
            process.exit(1);
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB đã kết nối đến Atlas!");
    } catch (error) {
        console.error("❌ Kết nối MongoDB thất bại:", error);
        process.exit(1);
    }
};

module.exports = connectDB;