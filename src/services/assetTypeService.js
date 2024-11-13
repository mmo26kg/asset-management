const { AssetType } = require('../models');

// Lấy tất cả các loại tài sản
exports.getAllAssetTypes = async () => {
    return await AssetType.findAll();
};

// Lấy một loại tài sản theo ID
exports.getAssetTypeById = async (id) => {
    return await AssetType.findByPk(id);
};

// Tạo mới một loại tài sản
exports.createAssetType = async (data) => {
    return await AssetType.create(data);
};

// Cập nhật một loại tài sản theo ID
exports.updateAssetType = async (id, data) => {
    const assetType = await AssetType.findByPk(id);
    if (!assetType) return null;
    await assetType.update(data);
    return assetType;
};

// Xóa một loại tài sản theo ID
exports.deleteAssetType = async (id) => {
    const assetType = await AssetType.findByPk(id);
    if (!assetType) return null;
    await assetType.destroy();
    return true;
};
