require('dotenv').config();
const { evaluateMail } = require('../data/evalutenote');
const express = require('express');
const nodeMailer = require('nodemailer');
const Evaluate = require("../model/evaluate");
const OrderSchema = require("../model/order");
const orderKicap = async (req, resp) => {
    const { fullName, phone, address, district, city, note, email, cart, total } = req.body;

    if (!fullName || !phone || !address || !district || !city || !email || !Array.isArray(cart.cart) || cart.cart.length === 0) {
        return resp.status(400).json({ message: "Vui lòng điền đầy đủ thông tin đơn hàng!" });
    }
    console.log("Email:", process.env.EMAIL);
    console.log("Password:", process.env.PASSWORD);
    try {
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // dùng true cho cổng 465
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        let cartHtml = req.body.cart.cart.map((item, index) => {

            return `
                <tr key=${index}>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                        <img src="http:${item.images[0]}" alt="${item.name}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 5px;" />
                    </td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.title}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${item.price}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">
                        ${(Number(item.quantity) * Number(item.price.replace(/[^\d]/g, "")) / 1000).toFixed(0)}.000đ
                    </td>
                </tr>
            `;
        }).join("");

        var message = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: "Xác nhận đơn hàng của bạn",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="text-align: center; color: #333;">🛒 Xác nhận đơn hàng</h2>
                <p><strong>Họ và Tên:</strong> ${req.body.fullName}</p>
                <p><strong>Điện thoại:</strong> ${req.body.phone}</p>
                <p><strong>Địa chỉ:</strong> ${req.body.address}, ${req.body.district}, ${req.body.city}</p>
                <p><strong>Ghi chú:</strong> ${req.body.note}</p>
                <h3 style="margin-top: 20px; color: #555;">📦 Chi tiết đơn hàng</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Hình ảnh</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Tên sản phẩm</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Số lượng</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Giá</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cartHtml}
                    </tbody>
                     <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">Tổng tiền:</td>
                        <td colspan="2" style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: red;">
                            ${req.body.cart.total}.000 VNĐ
                        </td>
                    </tr>
            </tfoot>
                </table>

                <br>
                <p style="text-align: center; font-size: 16px; color: #007bff;">Cảm ơn bạn đã đặt hàng! 💙</p>
            </div>
            `,
        };
        await transporter.sendMail(message);
        // Gửi email xác nhận đơn hàng đến khách hàng

        const orderData = {
            user_id: req.body.email,
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address,
            district: req.body.district,
            city: req.body.city,
            note: req.body.note,
            cart: req.body.cart.cart,
            total: req.body.cart.total,
        }
        // Lưu đơn hàng vào cơ sở dữ liệu
        const newOrder = await OrderSchema.create(orderData);
        await newOrder.save();
        return resp.status(200).json({ message: "Email đã gửi thành công!", data: "Completed" });

    } catch (err) {
        console.error("Lỗi server:", err);
        return resp.status(500).json({ message: "Lỗi server", error: err });
    }
};

const EvaluateKicap = async (req, resp) => {
    const { name, phone, email, message } = req.body;

    if (!email || !phone || !message || !name) {
        return resp.status(400).json({ message: "Thông tin đánh giá không hợp lệ!" });
    }

    try {
        const newEvaluate = await Evaluate.create({
            name,
            phone,
            email,
            message,
        });

        const allEvaluates = await Evaluate.find().sort({ createdAt: -1 });

        return resp.status(200).json({
            message: "Đánh giá đã được lưu thành công!",
            data: allEvaluates,
        });
    } catch (error) {
        console.error("Lỗi khi lưu đánh giá:", error);
        return resp.status(500).json({ message: "Lỗi server!" });
    }
};
module.exports = {
    orderKicap,
    EvaluateKicap,
};
