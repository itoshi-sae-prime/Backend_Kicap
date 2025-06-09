// models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    name: String,
    phone: String,
    company: String,
    province: String,
    district: String,
    ward: String,
    address: String,
    zip: String,
});

module.exports = mongoose.model('Address', addressSchema);
