const { Config } = require('../models');

// Lấy tất cả các cấu hình
exports.getAllConfigs = async () => {
    return await Config.findAll();
};

// Lấy một cấu hình theo ID
exports.getConfigById = async (id) => {
    return await Config.findByPk(id);
};

// Tạo mới một cấu hình
exports.createConfig = async (data) => {
    return await Config.create(data);
};

// Cập nhật một cấu hình theo ID
exports.updateConfig = async (id, data) => {
    const config = await Config.findByPk(id);
    if (!config) return null;
    await config.update(data);
    return config;
};

// Xóa một cấu hình theo ID
exports.deleteConfig = async (id) => {
    const config = await Config.findByPk(id);
    if (!config) return null;
    await config.destroy();
    return true;
};
