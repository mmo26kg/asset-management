const { Transaction } = require('../models');



exports.getAllTransactions = async (queryConditions, listOptions) => {
    return await Transaction.findAll({
        where: {
            ...queryConditions,
            ...listOptions.whereCondition,
        },
        order: [
            [listOptions.sortBy, listOptions.sortOrder],
        ],
        limit: listOptions.perpage,
        offset: listOptions.offset,
    });
};

exports.getAllMyTransactions = async (queryConditions, user, listOptions) => {
    return await Transaction.findAll({
        where: {
            ...queryConditions,
            userId: user.id,
            ...listOptions.whereCondition,
        },
        order: [
            [listOptions.sortBy, listOptions.sortOrder],
        ]
    });
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
exports.deleteTransaction = async (id) => {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return null;
    await transaction.destroy();
    return true;
};
