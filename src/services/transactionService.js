const { Transaction } = require('../models');
const deleteUtil = require('../utils/deleteUtil');




exports.getAllTransactions = async (queryConditions, listOptions) => {
    const result = await Transaction.findAndCountAll({
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

exports.getAllMyTransactions = async (queryConditions, user, listOptions) => {
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

// Lấy một giao dịch theo ID
exports.getTransactionById = async (id) => {
    return await Transaction.findByPk(id);
};

// Tạo mới một giao dịch
exports.createTransaction = async (data) => {
    return await Transaction.create(data);
};

// Cập nhật một giao dịch theo ID
exports.updateTransaction = async (id, data) => {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return null;
    await transaction.update(data);
    return transaction;
};

// Xóa một giao dịch theo ID
exports.deleteTransaction = async (id, option, checkDetail) => {
    const constraints = deleteUtil.TransactionDeleteConstraint;
    return await deleteUtil.deleteService(Transaction, id, constraints, option, checkDetail);
};
