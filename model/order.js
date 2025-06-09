const mongoose = require('mongoose');
const Counter = require('./counter'); // Bộ đếm để sinh order_id

const OrderSchema = new mongoose.Schema({
    order_id: { type: String, unique: true },
    user_id: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    note: { type: String }, // Ghi chú đơn hàng

    cart: [
        {
            title: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: String, required: true }
        }
    ],
    total: { type: Number, required: true },

    status: {
        type: String,
        enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'],
        default: 'pending'
    },
    status_history: [
        {
            status: String,
            time: { type: Date, default: Date.now }
        }
    ],

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Tự động sinh order_id trước khi lưu
OrderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: 'order_id' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        this.order_id = 'DH' + counter.seq.toString().padStart(4, '0');
    }
    next();
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
