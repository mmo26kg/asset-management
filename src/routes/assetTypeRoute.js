const express = require('express');
const router = express.Router();
const assetTypeController = require('../controllers/assetTypeController');
const authMiddleware = require('../middlewares/authMiddleware')
const sortMiddleware = require('../middlewares/sortMiddleware');


// Định nghĩa các route cho API của AssetType
router.get('/', authMiddleware.checkLogin, sortMiddleware, assetTypeController.getAllAssetTypes);          // Lấy tất cả các loại tài sản
router.get('/:id', authMiddleware.checkLogin, assetTypeController.getAssetTypeById);       // Lấy một loại tài sản theo ID
router.post('/',authMiddleware.checkSystemAdmin, assetTypeController.createAssetType);          // Tạo mới một loại tài sản
router.put('/:id',authMiddleware.checkSystemAdmin, assetTypeController.updateAssetType);        // Cập nhật một loại tài sản
router.delete('/:id', authMiddleware.checkSystemAdmin, assetTypeController.deleteAssetType);     // Xóa một loại tài sản

module.exports = router;
