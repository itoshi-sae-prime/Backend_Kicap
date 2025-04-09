const express = require("express");
const {
    getPost } = require('../controller/post.controller')
const router = express.Router();

router.get('/blog', getPost);

module.exports = router;