const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { User } = require('../models');
const listOptionsMiddleware = require('../middlewares/listOptionsMiddleware');


// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkSystemAdmin, listOptionsMiddleware, userController.getAllUsers);          // Lấy tất cả người dùng
router.get('/:id', authMiddleware.checkOwner(User), userController.getUserById);       // Lấy một người dùng theo ID
router.post('/', authMiddleware.checkSystemAdmin, userController.createUser);          // Tạo mới một người dùng
router.put('/:id', authMiddleware.checkOwner(User), userController.updateUser);        // Cập nhật một người dùng
router.delete('/:id/:option', authMiddleware.checkOwner(User), userController.deleteUser);     // Xóa một người dùng
// Option nhận giá trị: force, default, check

router.post('/register', userController.registerUser);  // Đăng ký một người dùng
router.post('/login', userController.loginUser);        // Đăng nhập vào một tài khoản người dùng

module.exports = router;
