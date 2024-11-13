const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

// Định nghĩa các route cho các API
router.get('/', configController.getAllConfigs);          // Lấy tất cả các cấu hình
router.get('/:id', configController.getConfigById);       // Lấy một cấu hình theo ID
router.post('/', configController.createConfig);          // Tạo mới một cấu hình
router.put('/:id', configController.updateConfig);        // Cập nhật một cấu hình
router.delete('/:id', configController.deleteConfig);     // Xóa một cấu hình

module.exports = router;
