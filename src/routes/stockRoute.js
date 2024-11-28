const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middlewares/authMiddleware')
const listOptionsMiddleware = require('../middlewares/listOptionsMiddleware');



// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkLogin, listOptionsMiddleware, stockController.getAllStocks);          // Lấy tất cả các cổ phiếu
router.get('/:id', authMiddleware.checkLogin, stockController.getStockById);       // Lấy một cổ phiếu theo ID
router.post('/', authMiddleware.checkSystemAdmin, stockController.createStock);          // Tạo mới một cổ phiếu
router.put('/:id', authMiddleware.checkSystemAdmin, stockController.updateStock);        // Cập nhật một cổ phiếu
router.delete('/:id/:option?/:checkDetail?', authMiddleware.checkSystemAdmin, stockController.deleteStock);     // Xóa một cổ phiếu

module.exports = router;
