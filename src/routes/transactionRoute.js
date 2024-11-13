const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Định nghĩa các route cho các API
router.get('/', transactionController.getAllTransactions);          // Lấy tất cả các giao dịch
router.get('/:id', transactionController.getTransactionById);       // Lấy một giao dịch theo ID
router.post('/', transactionController.createTransaction);          // Tạo mới một giao dịch
router.put('/:id', transactionController.updateTransaction);        // Cập nhật một giao dịch
router.delete('/:id', transactionController.deleteTransaction);     // Xóa một giao dịch

module.exports = router;
