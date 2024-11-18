const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const models = require('../models');
const authMiddleware = require('../middlewares/authMiddleware')
const sortMiddleware = require('../middlewares/sortMiddleware');


// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkSystemAdmin, sortMiddleware, configController.getAllConfigs);          // Lấy tất cả các cấu hình
router.get('/me', authMiddleware.checkLogin, sortMiddleware, configController.getAllMyConfigs);          // Lấy tất cả các cấu hình
router.get('/:id', authMiddleware.checkOwner(models.Config), configController.getConfigById);       // Lấy một cấu hình theo ID
router.post('/', authMiddleware.checkLogin, configController.createConfig);          // Tạo mới một cấu hình
router.put('/:id', authMiddleware.checkOwner(models.Config), configController.updateConfig);        // Cập nhật một cấu hình
router.delete('/:id', authMiddleware.checkOwner(models.Config), configController.deleteConfig);     // Xóa một cấu hình

module.exports = router;
