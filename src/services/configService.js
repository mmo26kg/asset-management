const Config = require('../models/Config');

// Lấy tất cả các danh mục
exports.getAllConfigs = async () => {
    return await Config.findAll();
};

// Lấy một danh mục theo ID
exports.getConfigById = async (id) => {
    return await Config.findByPk(id);
};

// Tạo mới một danh mục
exports.createConfig = async (data) => {
    return await Config.create(data);
};

// Cập nhật một danh mục theo ID
exports.updateConfig = async (id, data) => {
    const Config = await Config.findByPk(id);
    if (!Config) return null;
    await Config.update(data);
    return Config;
};

// Xóa một danh mục theo ID
exports.deleteConfig = async (id) => {
    const Config = await Config.findByPk(id);
    if (!Config) return null;
    await Config.destroy();
    return true;
};
