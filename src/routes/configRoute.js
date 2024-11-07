const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

// Định nghĩa các route cho các API
router.get('/', configController.getAllConfigs);           // Lấy tất cả các config
router.get('/:id', configController.getConfigById);         // Lấy một config theo ID
router.post('/', configController.createConfig);            // Tạo mới một config
router.put('/:id', configController.updateConfig);          // Cập nhật một config
router.delete('/:id', configController.deleteConfig);       // Xóa một config

module.exports = router;
