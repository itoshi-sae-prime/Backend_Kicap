const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../model/user.model');
const OrderModel = require('../model/order');
const AddressModel = require('../model/address');
const getUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await UserModel.findById(userId).select('-password'); // không trả password
        res.status(200).json(user);
    } catch (error) {
        res.status(200).json({ message: userId });
    }
}
const getOrderById = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await UserModel.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Tìm tất cả đơn hàng theo email hoặc userId
        const orders = await OrderModel.find({ user_id: user.email }); // hoặc: { userId: user._id }
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Từ JWT middleware

    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Thay đổi mật khẩu thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};
const updateInformation = async (req, res) => {
    const { phone } = req.body;
    const userId = req.user.id;

    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

        // Nếu có phone thì mới cập nhật
        if (phone && phone.trim() !== "") {
            user.phone = phone.trim();
        }

        await user.save();

        res.status(200).json({ message: 'Cập nhật thành công.', user });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật.', error: error.message });
    }

}
const createAddress = async (req, res) => {
    const userId = req.user.id;
    const { body } = req.body
    try {
        const newAddress = new AddressModel({
            ...req.body,
            user_id: req.user.id
        });
        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lưu địa chỉ', error: err });
    }
}
const getAddress = async (req, res) => {
    const userId = req.user.id;
    try {
        const address = await AddressModel.find({ user_id: userId });
        res.status(200).json(address);
    } catch (err) {
        res.status(500).json({ message: 'Hong có địa chỉ nào cả', error: err });
    }
}
const deleteAddress = async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.id;
    try {
        const address = await AddressModel.findOne({ _id: addressId, user_id: userId });
        if (!address) {
            return res.status(404).json({ message: 'Không tìm thấy địa chỉ.' });
        }

        // Xóa địa chỉ
        await AddressModel.deleteOne({ _id: addressId });

        res.status(200).json({ message: 'Đã xóa địa chỉ thành công.' });
    } catch (err) {
        console.error('Lỗi khi xóa địa chỉ:', err);
        res.status(500).json({ message: 'Lỗi server khi xóa địa chỉ.' });
    }
};
module.exports = { getUser, getOrderById, updatePassword, updateInformation, createAddress, getAddress, deleteAddress };