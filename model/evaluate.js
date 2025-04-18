const mongoose = require("mongoose");

const EvaluateSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    message: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model("Evaluate", EvaluateSchema);
