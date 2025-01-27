const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Route để lấy URL upload ảnh
router.get('/upload-url', imageController.getUploadUrl);

// Route để lấy URL tải ảnh
router.get('/:imageKey', imageController.getImageUrl);

module.exports = router;
