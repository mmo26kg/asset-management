const { Account } = require('../models');
const { User } = require('../models');


// Hàm lấy danh sách tài khoản theo điều kiện từ query parameters
exports.getAllAccounts = async (queryConditions, sortOptions) => {
    // delete queryConditions.sortBy;
    // delete queryConditions.sortOrder;
    const sortBy = sortOptions.sortBy;
    const sortOrder = sortOptions.sortOrder;

    return await Account.findAll({
        where: {
            ...queryConditions,
        },
        order: [
            [sortBy, sortOrder],
        ]
    });
};

// Hàm lấy danh sách tài khoản theo điều kiện từ query parameters
exports.getAllMyAccounts = async (queryConditions, user) => {
    return await Account.findAll({
        where: {
            ...queryConditions,
            userId: user.id,
        },
    });
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
