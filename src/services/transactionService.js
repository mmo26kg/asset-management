const { Transaction } = require('../models');
const deleteUtil = require('../utils/deleteUtil');
const transactionHook = require('../hooks/transactionHook');



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
    const transaction = await Transaction.create(data)
    transactionHook.afterCreate(transaction);
    return transaction;
};

// Cập nhật một giao dịch theo ID
exports.updateTransaction = async (id, data) => {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return null;
    await transaction.update(data);
    transactionHook.afterUpdate(transaction);
    return transaction;
};

// Xóa một giao dịch theo ID
exports.deleteTransaction = async (id, option, checkDetail) => {
    const transaction = await Transaction.findByPk(id);
    const constraints = deleteUtil.TransactionDeleteConstraint;
    const result = await deleteUtil.deleteService(Transaction, id, constraints, option, checkDetail);
    transactionHook.afterDelete(transaction);
    return result;
};



// API nâng cao

// exports.getAllTransactionAmountByAccount = async (accountId) => {
//     try {
//         console.log('getAllTransactionAmountByAccount: Đang lấy danh sách transaction cho accountId:', accountId);

//         const result = await Transaction.findAll({
//             where: {
//                 accountId,
//             },
//             attributes: ['id', 'amount'],
//         });

//         return result;
//     } catch (error) {
//         console.error('getAllTransactionAmountByAccount: Đã xảy ra lỗi trong quá trình lấy dữ liệu:', error);
//         throw error; // Ném lỗi để xử lý tiếp ở cấp cao hơn
//     }
// };

