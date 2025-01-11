// UserBalanceService.js
const { UserBalance, Transaction } = require('../models');
const deleteUtil = require('../utils/deleteUtil');
const TreeModel = require('tree-model');




//#region 1. API cơ bản

exports.getAllUserBalances = async (queryConditions, listOptions) => {
    const result = await UserBalance.findAndCountAll({
        where: { ...queryConditions, ...listOptions.whereCondition },
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

exports.getUserBalanceById = async (id) => await UserBalance.findByPk(id);

exports.createUserBalance = async (data) => {
    const existingUserBalance = await this.checkExistUserBalance(
        data.userId,
        data.balanceType,
        data.accountId || data.categoryId || data.assetTypeId
    );

    if (existingUserBalance) {
        return existingUserBalance;
    }

    return await UserBalance.create(data);
};

exports.updateUserBalance = async (id, data) => {
    const userBalance = await UserBalance.findByPk(id);
    if (!userBalance) throw new Error(`UserBalance không tồn tại với ID: ${id}`);
    return await userBalance.update(data);
};

exports.deleteUserBalance = async (id, option, checkDetail) => {
    const constraints = deleteUtil.UserBalanceDeleteConstraint;
    return await deleteUtil.deleteService(UserBalance, id, constraints, option, checkDetail);
};

//#endregion

//#region 2. API nâng cao
exports.checkExistUserBalance = async (userId, balanceType, referId) => {
    const condition = {
        userId,
        balanceType,
        ...(balanceType === 'account' && { accountId: referId }),
        ...(balanceType === 'category' && { categoryId: referId }),
        ...(balanceType === 'assetType' && { assetTypeId: referId }),
    };

    return await UserBalance.findOne({ where: condition });
};

exports.updateBalanceByUser = async (id, newBalance) => {
    try {
        const userBalance = await UserBalance.findByPk(id);

        if (!userBalance) throw new Error(`Không tìm thấy UserBalance với ID: ${id}`);
        return await userBalance.update({ balance: newBalance });
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật số dư cho UserBalance ID ${id}: ${error.message}`);
    }
};
