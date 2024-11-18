const { Transaction } = require('../models');



exports.getAllTransactions = async (queryConditions, sortOptions) => {
    return await Transaction.findAll({
        where: {
            ...queryConditions,
        },
        order: [
            [sortOptions.sortBy, sortOptions.sortOrder],
        ]
    });
};

exports.getAllMyTransactions = async (queryConditions, user, sortOptions) => {
    return await Transaction.findAll({
        where: {
            ...queryConditions,
            userId: user.id,
        },
        order: [
            [sortOptions.sortBy, sortOptions.sortOrder],
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
