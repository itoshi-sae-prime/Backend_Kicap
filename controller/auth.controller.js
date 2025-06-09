const express = require("express");
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const registerKicap = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create a new user
        const userUser = await User.create({ name: name, email: email, password: hashedPassword });

        // Save the user to the database
        const user = await userUser.save();
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const loginKicap = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Wrong user" });
        }
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Wrong password" });
        }
        if (user && validPassword) {
            const accessToken = jwt.sign({
                id: user.id,
            },
                process.env.JWT_SECRET,
                { expiresIn: "30h" },
            )
            const { password, ...others } = user._doc;
            res.status(200).json({ others, accessToken });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const logoutKicap = async (req, res) => {
    try {
        // Xóa token khỏi client (nếu cần thiết)
        res.clearCookie("token"); // Hoặc xóa localStorage nếu bạn lưu token ở đó
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = { registerKicap, loginKicap, logoutKicap };
