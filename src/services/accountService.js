const { Account } = require('../models');

// Lấy tất cả các tài khoản
exports.getAllAccounts = async () => {
    return await Account.findAll();
};

// Lấy một tài khoản theo ID
exports.getAccountById = async (id) => {
    return await Account.findByPk(id);
};

// Tạo mới một tài khoản
exports.createAccount = async (data) => {
    return await Account.create(data);
};

// Cập nhật một tài khoản theo ID
exports.updateAccount = async (id, data) => {
    const account = await Account.findByPk(id);
    if (!account) return null;
    await account.update(data);
    return account;
};

// Xóa một tài khoản theo ID
exports.deleteAccount = async (id) => {
    const account = await Account.findByPk(id);
    if (!account) return null;
    await account.destroy();
    return true;
};
