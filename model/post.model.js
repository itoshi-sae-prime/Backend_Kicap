const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    images: { type: [String], required: [true] }, // Mảng String
    title: { type: String, required: [true] },
    description: { type: String, required: [true] },
},
    {
        timestamps: true
    });
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;