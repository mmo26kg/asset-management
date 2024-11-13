const express = require('express');
const router = express.Router();
const assetTypeController = require('../controllers/assetTypeController');

// Định nghĩa các route cho API của AssetType
router.get('/', assetTypeController.getAllAssetTypes);          // Lấy tất cả các loại tài sản
router.get('/:id', assetTypeController.getAssetTypeById);       // Lấy một loại tài sản theo ID
router.post('/', assetTypeController.createAssetType);          // Tạo mới một loại tài sản
router.put('/:id', assetTypeController.updateAssetType);        // Cập nhật một loại tài sản
router.delete('/:id', assetTypeController.deleteAssetType);     // Xóa một loại tài sản

module.exports = router;
