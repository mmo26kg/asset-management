const { Config } = require('../models');


// Hàm lấy danh sách tài khoản theo điều kiện từ query parameters
exports.getAllConfigs = async (queryConditions, sortOptions) => {
    return await Config.findAll({
        where: {
            ...queryConditions,
        },
        order: [
            [sortOptions.sortBy, sortOptions.sortOrder],
        ]
    });
};


// Hàm lấy danh sách tài khoản theo điều kiện từ query parameters
exports.getAllMyConfigs = async (queryConditions, user, sortOptions) => {
    return await Config.findAll({
        where: {
            ...queryConditions,
            userId: user.id,
        },
        order: [
            [sortOptions.sortBy, sortOptions.sortOrder],
        ]
        
    });
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
