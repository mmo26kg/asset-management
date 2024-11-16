const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');
const middleware = require('../middlewares/authMiddleware')


// Định nghĩa các route cho các API
router.get('/', middleware.authenticateUser, currencyController.getAllCurrencies);          // Lấy tất cả các loại tiền tệ
router.get('/:id', middleware.authenticateUser, currencyController.getCurrencyById);        // Lấy một loại tiền tệ theo ID
router.post('/', middleware.authenticateUser, currencyController.createCurrency);           // Tạo mới một loại tiền tệ
router.put('/:id', middleware.authenticateUser, currencyController.updateCurrency);         // Cập nhật một loại tiền tệ
router.delete('/:id', middleware.authenticateUser, currencyController.deleteCurrency);      // Xóa một loại tiền tệ

module.exports = router;
