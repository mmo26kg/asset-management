const express = require('express');
const router = express.Router();
const userBalanceController = require('../controllers/userBalanceController');
const authMiddleware = require('../middlewares/authMiddleware')

// Định nghĩa các route cho các API
router.get('/', userBalanceController.getAllUserBalances);          // Lấy tất cả số dư người dùng
router.get('/:id', userBalanceController.getUserBalanceById);       // Lấy một số dư người dùng theo ID
router.post('/', userBalanceController.createUserBalance);          // Tạo mới một số dư người dùng
router.put('/:id', userBalanceController.updateUserBalance);        // Cập nhật một số dư người dùng
router.delete('/:id', userBalanceController.deleteUserBalance);     // Xóa một số dư người dùng

module.exports = router;
