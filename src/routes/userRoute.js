const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware')

// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkLogin, userController.getAllUsers);          // Lấy tất cả người dùng
router.get('/:id', userController.getUserById);       // Lấy một người dùng theo ID
router.post('/', userController.createUser);          // Tạo mới một người dùng
router.put('/:id', userController.updateUser);        // Cập nhật một người dùng
router.delete('/:id', userController.deleteUser);     // Xóa một người dùng


router.post('/register', userController.registerUser);  // Đăng ký một người dùng
router.post('/login', userController.loginUser);        // Đăng nhập vào một tài khoản người dùng

module.exports = router;
