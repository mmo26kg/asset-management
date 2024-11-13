const { Transaction } = require('../models');

// Lấy tất cả các giao dịch
exports.getAllTransactions = async () => {
    return await Transaction.findAll();
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
