const express = require('express');
const router = express.Router();
const userBalanceController = require('../controllers/userBalanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const { UserBalance } = require('../models');
const sortMiddleware = require('../middlewares/sortMiddleware');

// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkSystemAdmin, sortMiddleware, userBalanceController.getAllUserBalances);          // Lấy tất cả số dư người dùng
router.get('/:id', authMiddleware.checkOwner(UserBalance), userBalanceController.getUserBalanceById);       // Lấy một số dư người dùng theo ID
router.post('/', userBalanceController.createUserBalance);          // Tạo mới một số dư người dùng
router.put('/:id', authMiddleware.checkOwner(UserBalance), userBalanceController.updateUserBalance);        // Cập nhật một số dư người dùng
router.delete('/:id', authMiddleware.checkSystemAdmin, userBalanceController.deleteUserBalance);     // Xóa một số dư người dùng

module.exports = router;
