const { Config } = require('../models');
const deleteUtil = require('../utils/deleteUtil');


// Hàm lấy danh sách tài khoản theo điều kiện từ query parameters
exports.getAllConfigs = async (queryConditions, listOptions) => {
    const result = await Config.findAndCountAll({
        where: {
            ...queryConditions,
            ...listOptions.whereCondition,
        },
        order: [[listOptions.sortBy, listOptions.sortOrder]],
        limit: listOptions.perpage,
        offset: listOptions.offset,
    });

    return {
        totalResults: result.count,
        totalPages: Math.ceil(result.count / listOptions.perpage),
        currentPage: listOptions.page,
        perPage: listOptions.perpage,
        data: result.rows,
    };
};


// Hàm lấy danh sách tài khoản theo điều kiện từ query parameters
exports.getAllMyConfigs = async (queryConditions, user, listOptions) => {
    const result = await Account.findAndCountAll({
        where: {
            ...queryConditions,
            userId: user.id,
            ...listOptions.whereCondition,
        },
        order: [[listOptions.sortBy, listOptions.sortOrder]],
        limit: listOptions.perpage,
        offset: listOptions.offset,
    });

    return {
        totalResults: result.count,
        totalPages: Math.ceil(result.count / listOptions.perpage),
        currentPage: listOptions.page,
        perPage: listOptions.perpage,
        data: result.rows,
    };
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
exports.deleteConfig = async (id, option, checkDetail) => {
    const constraints = deleteUtil.ConfigDeleteConstraint;
    return await deleteUtil.deleteService(Config, id, constraints, option, checkDetail);
};


