const { UserBalance } = require('../models');
const deleteUtil = require('../utils/deleteUtil');


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
    const existingUserBalance = await UserBalance.findOne({
        where: {
            userId: data.userId,
            balanceType: data.balanceType
        },
    });

    // Nếu đã tồn tại, bỏ qua việc tạo mới
    if (existingUserBalance) {
        console.log(`UserBalance với type "${data.balanceType}" cho userId ${data.userId} đã tồn tại.`);
        return existingUserBalance;
    }

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
exports.deleteUserBalance = async (id, option, checkDetail) => {
    const constraints = deleteUtil.UserBalanceDeleteConstraint;
    return await deleteUtil.deleteService(UserBalance, id, constraints, option, checkDetail);
};
