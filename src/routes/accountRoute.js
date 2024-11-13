const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Định nghĩa các route cho các API
router.get('/', accountController.getAllAccounts);          // Lấy tất cả các tài khoản
router.get('/:id', accountController.getAccountById);       // Lấy một tài khoản theo ID
router.post('/', accountController.createAccount);          // Tạo mới một tài khoản
router.put('/:id', accountController.updateAccount);        // Cập nhật một tài khoản
router.delete('/:id', accountController.deleteAccount);     // Xóa một tài khoản

module.exports = router;
