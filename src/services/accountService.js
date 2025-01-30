const { Account, AssetType } = require('../models');
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
                attributes: ['id', 'name', 'icon'],
                include: [
                    {
                        model: AssetType,
                        as: 'assetType', // Trùng với alias đã khai báo trong model
                        attributes: ['id', 'name', 'icon'],
                    }
                ]
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
                attributes: ['id', 'name', 'icon'],
                include: [
                    {
                        model: AssetType,
                        as: 'assetType',
                        attributes: ['id', 'name', 'icon'],
                    }
                ]
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

// Hàm lấy danh sách tài khoản của một user
exports.getAllMyAccountsByAssetType = async (queryConditions, user, assetTypeId, listOptions) => {
    const result = await Account.findAndCountAll({
        where: {
            ...queryConditions,
            userId: user.id, // Chỉ lấy tài khoản thuộc user hiện tại
            ...listOptions.whereCondition,
        },
        order: [[listOptions.sortBy, listOptions.sortOrder]],
        // limit: listOptions.perpage,
        // offset: listOptions.offset,
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'icon'],
                include: [
                    {
                        model: AssetType,
                        as: 'assetType',
                        attributes: ['id', 'name', 'icon'],
                    }
                ]
            }
        ]
    });

    // Lọc lại danh sách dựa vào assetTypeId
    const filteredData = result.rows.filter(account =>
        account.category?.assetType?.id === assetTypeId
    );

    // Tính tổng số kết quả sau khi lọc
    const totalResults = filteredData.length;
    const totalPages = Math.ceil(totalResults / listOptions.perpage);

    // Cắt danh sách theo pagination
    const paginatedData = filteredData.slice(
        listOptions.offset,
        listOptions.offset + listOptions.perpage
    );

    return {
        totalResults, // Tổng số kết quả sau lọc
        totalPages, // Tổng số trang
        currentPage: listOptions.page,
        perPage: listOptions.perpage,
        data: paginatedData, // Danh sách đã cắt theo page
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