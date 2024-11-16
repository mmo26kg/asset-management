const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middlewares/authMiddleware')


// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkLogin, stockController.getAllStocks);          // Lấy tất cả các cổ phiếu
router.get('/:id', stockController.getStockById);       // Lấy một cổ phiếu theo ID
router.post('/', stockController.createStock);          // Tạo mới một cổ phiếu
router.put('/:id', stockController.updateStock);        // Cập nhật một cổ phiếu
router.delete('/:id', stockController.deleteStock);     // Xóa một cổ phiếu

module.exports = router;
