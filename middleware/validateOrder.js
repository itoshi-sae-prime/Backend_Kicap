const { body, validationResult } = require("express-validator");

const validateOrder = [
    body("fullName").notEmpty().withMessage("Họ tên không được để trống"),
    body("phone").matches(/^[0-9]{9,12}$/).withMessage("Số điện thoại không hợp lệ"),
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("address").notEmpty().withMessage("Địa chỉ không được để trống"),
    body("district").notEmpty().withMessage("Quận/Huyện không được để trống"),
    body("city").notEmpty().withMessage("Thành phố không được để trống"),
    body("cart.cart").isArray({ min: 1 }).withMessage("Giỏ hàng không hợp lệ"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = validateOrder;