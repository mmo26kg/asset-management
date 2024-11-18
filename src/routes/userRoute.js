const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { User } = require('../models');
const sortMiddleware = require('../middlewares/sortMiddleware');


// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkSystemAdmin, sortMiddleware, userController.getAllUsers);          // Lấy tất cả người dùng
router.get('/:id', authMiddleware.checkOwner(User), userController.getUserById);       // Lấy một người dùng theo ID
router.post('/', authMiddleware.checkSystemAdmin, userController.createUser);          // Tạo mới một người dùng
router.put('/:id', authMiddleware.checkOwner(User), userController.updateUser);        // Cập nhật một người dùng
router.delete('/:id', authMiddleware.checkOwner(User), userController.deleteUser);     // Xóa một người dùng


router.post('/register', userController.registerUser);  // Đăng ký một người dùng
router.post('/login', userController.loginUser);        // Đăng nhập vào một tài khoản người dùng

module.exports = router;
