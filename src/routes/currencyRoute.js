const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');
const authMiddleware = require('../middlewares/authMiddleware')

// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkLogin, currencyController.getAllCurrencies);          // Lấy tất cả các loại tiền tệ
router.get('/:id', currencyController.getCurrencyById);        // Lấy một loại tiền tệ theo ID
router.post('/', currencyController.createCurrency);           // Tạo mới một loại tiền tệ
router.put('/:id', currencyController.updateCurrency);         // Cập nhật một loại tiền tệ
router.delete('/:id', currencyController.deleteCurrency);      // Xóa một loại tiền tệ

module.exports = router;
