const { UserBalance } = require('../models');

// Lấy tất cả UserBalance dựa trên các điều kiện tìm kiếm
exports.getAllUserBalances = async (queryConditions, listOptions) => {
    const result = await UserBalance.findAndCountAll({
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

// Lấy một UserBalance theo ID
exports.getUserBalanceById = async (id) => {
    return await UserBalance.findByPk(id);
};

// Tạo mới một UserBalance
exports.createUserBalance = async (data) => {
    return await UserBalance.create(data);
};

// Cập nhật một UserBalance theo ID
exports.updateUserBalance = async (id, data) => {
    const userBalance = await UserBalance.findByPk(id);
    if (!userBalance) return null;
    await userBalance.update(data);
    return userBalance;
};

// Xóa một UserBalance theo ID
exports.deleteUserBalance = async (id) => {
    const userBalance = await UserBalance.findByPk(id);
    if (!userBalance) return null;
    await userBalance.destroy();
    return true;
};
