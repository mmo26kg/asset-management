// UserBalanceService.js

const { UserBalance } = require('../models');
const deleteUtil = require('../utils/deleteUtil');
const transactionService = require('../services/transactionService');

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
    const existingUserBalance = await UserBalance.findOne({
        where: {
            userId: data.userId,
            balanceType: data.balanceType,
            ...(data.balanceType === 'account' && { accountId: data.accountId }),
            ...(data.balanceType === 'category' && { categoryId: data.categoryId }),
            ...(data.balanceType === 'assetType' && { assetTypeId: data.assetTypeId }),
        },
    });

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

exports.updateBalanceByUser = async (id, newBalance) => {
    try {
        const userBalance = await UserBalance.findByPk(id);

        if (!userBalance) throw new Error(`Không tìm thấy UserBalance với ID: ${id}`);
        return await userBalance.update({ balance: newBalance });
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật số dư cho UserBalance ID ${id}: ${error.message}`);
    }
};

exports.updateRelatedUBbyTransaction = async (transaction) => {
    await this.syncAccountUB(transaction.accountId);
};

exports.syncAccountUB = async (accountId) => {
    try {
        const transactions = await transactionService.getAllTransactionAmountByAccount(accountId);

        if (!transactions || transactions.length === 0) {
            throw new Error(`Không có giao dịch nào cho accountId: ${accountId}`);
        }

        const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const userBalance = await UserBalance.findOne({ where: { accountId } });

        if (!userBalance) throw new Error(`Không tìm thấy UserBalance cho accountId: ${accountId}`);

        await userBalance.update({ balance: totalAmount });
    } catch (error) {
        throw new Error(`Lỗi khi đồng bộ số dư cho accountId ${accountId}: ${error.message}`);
    }
};

//#endregion

//#region 3. API dự phòng

exports.syncCategoryUB = () => {
    throw new Error('Chức năng đồng bộ Category UB chưa được triển khai.');
};

exports.syncAssetTypeUB = () => {
    throw new Error('Chức năng đồng bộ Asset Type UB chưa được triển khai.');
};

exports.syncAssetUB = () => {
    throw new Error('Chức năng đồng bộ Asset UB chưa được triển khai.');
};

//#endregion