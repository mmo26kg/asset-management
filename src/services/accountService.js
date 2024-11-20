const { Account } = require('../models');
const { User } = require('../models');


// Hàm lấy danh sách tài khoản theo điều kiện từ query parameters
exports.getAllAccounts = async (queryConditions, listOptions) => {

    return await Account.findAll({
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

// Hàm lấy danh sách tài khoản theo điều kiện từ query parameters
exports.getAllMyAccounts = async (queryConditions, user, listOptions) => {
    return await Account.findAll({
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
