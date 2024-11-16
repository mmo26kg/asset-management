const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware')

// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkLogin, categoryController.getAllCategories);           // Lấy tất cả các danh mục
router.get('/:id', categoryController.getCategoryById);         // Lấy một danh mục theo ID
router.post('/', categoryController.createCategory);            // Tạo mới một danh mục
router.put('/:id', categoryController.updateCategory);          // Cập nhật một danh mục
router.delete('/:id', categoryController.deleteCategory);       // Xóa một danh mục

module.exports = router;
