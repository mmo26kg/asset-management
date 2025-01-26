const { Account } = require('../models');
const { Category } = require('../models');

const deleteUtil = require('../utils/deleteUtil');
const accountHook = require('../hooks/accountHook');

// const { User } = require('../models');

// Hàm lấy danh sách tài khoản theo điều kiện từ query parameters
exports.getAllAccounts = async (queryConditions, listOptions) => {
    const result = await Account.findAndCountAll({
        where: {
            ...queryConditions,
            ...listOptions.whereCondition,
        },
        order: [[listOptions.sortBy, listOptions.sortOrder]],
        limit: listOptions.perpage,
        offset: listOptions.offset,
        include: [
            {
                model: Category,
                as: 'category', // Trùng với alias đã khai báo trong model
                attributes: ['id', 'name', 'icon']
            }
        ]
    });

    return {
        totalResults: result.count,
        totalPages: Math.ceil(result.count / listOptions.perpage),
        currentPage: listOptions.page,
        perPage: listOptions.perpage,
        data: result.rows,
    };
};

// Hàm lấy danh sách tài khoản của một user
exports.getAllMyAccounts = async (queryConditions, user, listOptions) => {
    const result = await Account.findAndCountAll({
        where: {
            ...queryConditions,
            userId: user.id, // Chỉ lấy tài khoản thuộc user hiện tại
            ...listOptions.whereCondition,
        },
        order: [[listOptions.sortBy, listOptions.sortOrder]],
        limit: listOptions.perpage,
        offset: listOptions.offset,
        include: [
            {
                model: Category,
                as: 'category', // Trùng với alias đã khai báo trong model
                attributes: ['id', 'name', 'icon']
            }
        ]

    });

    return {
        totalResults: result.count, // Tổng số kết quả
        totalPages: Math.ceil(result.count / listOptions.perpage), // Tổng số trang
        currentPage: listOptions.page, // Trang hiện tại
        perPage: listOptions.perpage, // Số lượng trên mỗi trang
        data: result.rows, // Danh sách kết quả
    };
};


// Lấy một tài khoản theo ID
exports.getAccountById = async (id) => {
    return await Account.findByPk(id, {
        include: [
            {
                model: Category,
                as: 'category', // Trùng với alias đã khai báo trong model
                attributes: ['id', 'name', 'icon']
            }
        ]
    });
};

// Tạo mới một tài khoản
exports.createAccount = async (data) => {
    const account = await Account.create(data);
    accountHook.afterCreate(account);
    return account;
};

// Cập nhật một tài khoản theo ID
exports.updateAccount = async (id, data) => {
    const account = await Account.findByPk(id);
    let updateCategory = false;
    if (data.categoryId !== account.dataValues.categoryId) {
        updateCategory = true;
    }
    if (!account) return null;
    await account.update(data);
    accountHook.afterUpdate(account, data, updateCategory);
    return account;
};


exports.deleteAccount = async (id, option, checkDetail) => {
    const constraints = deleteUtil.AccountDeleteConstraint;
    return await deleteUtil.deleteService(Account, id, constraints, option, checkDetail);
};