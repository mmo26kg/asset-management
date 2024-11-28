const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const { Transaction } = require('../models');
const listOptionsMiddleware = require('../middlewares/listOptionsMiddleware');


// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkSystemAdmin, listOptionsMiddleware, transactionController.getAllTransactions);          // Lấy tất cả các giao dịch
router.get('/me', authMiddleware.checkLogin, listOptionsMiddleware, transactionController.getAllMyTransactions);          // Lấy tất cả các giao dịch
router.get('/:id', authMiddleware.checkOwner(Transaction), transactionController.getTransactionById);       // Lấy một giao dịch theo ID
router.post('/', authMiddleware.checkLogin, transactionController.createTransaction);          // Tạo mới một giao dịch
router.put('/:id', authMiddleware.checkOwner(Transaction), transactionController.updateTransaction);        // Cập nhật một giao dịch
router.delete('/:id/:option?/:checkDetail?', authMiddleware.checkOwner(Transaction), transactionController.deleteTransaction);     // Xóa một giao dịch

module.exports = router;
