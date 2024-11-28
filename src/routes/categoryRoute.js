const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware')
const listOptionsMiddleware = require('../middlewares/listOptionsMiddleware');

// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkLogin, listOptionsMiddleware, categoryController.getAllCategories);           // Lấy tất cả các danh mục
router.get('/:id', authMiddleware.checkLogin, categoryController.getCategoryById);         // Lấy một danh mục theo ID
router.post('/', authMiddleware.checkSystemAdmin, categoryController.createCategory);            // Tạo mới một danh mục
router.put('/:id', authMiddleware.checkSystemAdmin, categoryController.updateCategory);          // Cập nhật một danh mục
router.delete('/:id/:option?/:checkDetail?', authMiddleware.checkSystemAdmin, categoryController.deleteCategory);       // Xóa một danh mục

module.exports = router;
