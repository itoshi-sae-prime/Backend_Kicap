const express = require('express');
const nodeMailer = require('nodemailer');

const orderKicap = async (req, resp) => {
    try {
        const { fullName, phone, address, district, city, note, email, cart, total } = req.body;

          if (!email || !cart.cart || !Array.isArray(cart.cart) || cart.cart.length === 0) {
            return resp.status(400).json({ message: "Thông tin đơn hàng không hợp lệ!" });
        }

        let transporter = nodeMailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
            logger: true,
            debug: true,
        });

        const cartHtml = cart.map((item, index) => {
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

        const message = {
            from: process.env.EMAIL,
            to: email,
            subject: "Xác nhận đơn hàng của bạn",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="text-align: center; color: #333;">🛒 Xác nhận đơn hàng</h2>
                    <p><strong>Họ và Tên:</strong> ${fullName}</p>
                    <p><strong>Điện thoại:</strong> ${phone}</p>
                    <p><strong>Địa chỉ:</strong> ${address}, ${district}, ${city}</p>
                    <p><strong>Ghi chú:</strong> ${note}</p>
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
                                    ${total}.000 VNĐ
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
        return resp.status(200).json({ message: "Email đã gửi thành công!" });
    } catch (err) {
        console.error("Lỗi server:", err);
        return resp.status(500).json({ message: "Lỗi server", error: err });
    }
};

module.exports = {
    orderKicap
};
