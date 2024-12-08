// ================== Import các service và model liên quan ==================
const { Account, Transaction } = require('../models');
const userBalanceService = require('../services/userBalanceService');
const transactionService = require('../services/transactionService');
const accountService = require('../services/accountService');
const categoryService = require('../services/categoryService');
const enumUtil = require('../utils/enumUtil'); // Import các hàm tiện ích Enum

// ================== Hàm chính xử lý afterCreate của Account ==================
/**
 * Hàm xử lý logic sau khi một tài khoản (Account) được tạo.
 * Thực hiện các công việc chính:
 * 1. Tạo UserBalance cho Account mới.
 * 2. Tạo UserBalance cho các Category liên quan (kể cả các Category cấp cha).
 * 3. Tạo UserBalance cho AssetType liên quan.
 * 4. Tạo Transaction số dư đầu kỳ cho Account.
 * 
 * @param {Object} account - Dữ liệu của Account vừa được tạo.
 */
exports.afterCreate = async (account) => {
    try {
        // === 1. Tạo UserBalance cho Account mới ===
        const accountUserBalance = await createAccountUserBalance(account);

        // === 2. Tạo UserBalance cho các Category liên quan ===
        const { categoryUserBalances, assetTypeId } = await createCategoryUserBalances(account.userId, account.categoryId);
        console.log('Danh sách UserBalance của các Category:', categoryUserBalances);

        // === 3. Tạo UserBalance cho AssetType liên quan ===
        if (assetTypeId) {
            const assetTypeUserBalance = await createAssetTypeUserBalance(account.userId, assetTypeId);
            console.log('UserBalance của AssetType:', assetTypeUserBalance.dataValues);
        } else {
            console.warn('Không xác định được AssetType liên quan đến Account.');
        }

        // === 4. Tạo Transaction số dư đầu kỳ cho Account ===
        const defaultTransaction = await createDefaultTransaction(account);
        console.log('Transaction số dư đầu kỳ đã được tạo:', defaultTransaction.dataValues);

    } catch (error) {
        console.error('Lỗi trong afterCreate:', error);
        throw error;
    }
};

// ================== Các hàm tiện ích được tách ra để tái sử dụng ==================

/**
 * Tạo UserBalance cho một Account mới.
 * 
 * @param {Object} account - Dữ liệu của Account vừa được tạo.
 * @returns {Object} UserBalance đã được tạo.
 */
async function createAccountUserBalance(account) {
    try {
        const accountUserBalance = await userBalanceService.createUserBalance({
            balanceType: 'account',
            userId: account.userId,
            accountId: account.id
        });
        console.log('UserBalance của Account:', accountUserBalance.dataValues);
        return accountUserBalance;
    } catch (error) {
        console.error('Lỗi khi tạo UserBalance cho Account:', error);
        throw error;
    }
}

/**
 * Tạo UserBalance cho tất cả các Category liên quan, bao gồm cả cấp cha.
 * 
 * @param {number} userId - ID của User.
 * @param {number} categoryId - ID của Category hiện tại.
 * @returns {Object} - Trả về danh sách UserBalance của các Category và AssetTypeId.
 */
async function createCategoryUserBalances(userId, categoryId) {
    const queue = [categoryId]; // Hàng đợi để xử lý các category
    const categoryUserBalances = []; // Danh sách các UserBalance đã tạo
    let assetTypeId = null;

    try {
        while (queue.length > 0) {
            const currentCategoryId = queue.shift(); // Lấy category đầu tiên từ hàng đợi

            // Tạo UserBalance cho category hiện tại
            const newUserBalance = await userBalanceService.createUserBalance({
                balanceType: 'category',
                userId: userId,
                categoryId: currentCategoryId
            });

            if (newUserBalance) {
                categoryUserBalances.push(newUserBalance.dataValues);
            }

            // Lấy thông tin category và cha của nó
            const currentCategory = await categoryService.getCategoryById(currentCategoryId);
            const parentCategoryId = currentCategory?.parentId;

            // Nếu có category cha, thêm vào hàng đợi để xử lý
            if (parentCategoryId) {
                queue.push(parentCategoryId);
            } else {
                assetTypeId = currentCategory?.assetTypeId; // Gán assetTypeId khi gặp category gốc
            }
        }
    } catch (error) {
        console.error('Lỗi khi tạo UserBalance cho các Category:', error);
        throw error;
    }

    return { categoryUserBalances, assetTypeId };
}

/**
 * Tạo UserBalance cho AssetType liên quan đến Account.
 * 
 * @param {number} userId - ID của User.
 * @param {number} assetTypeId - ID của AssetType.
 * @returns {Object} UserBalance của AssetType.
 */
async function createAssetTypeUserBalance(userId, assetTypeId) {
    try {
        const assetTypeUserBalance = await userBalanceService.createUserBalance({
            balanceType: 'assetType',
            userId: userId,
            assetTypeId: assetTypeId
        });
        return assetTypeUserBalance;
    } catch (error) {
        console.error('Lỗi khi tạo UserBalance cho AssetType:', error);
        throw error;
    }
}

/**
 * Tạo Transaction mặc định (số dư đầu kỳ) cho một Account mới.
 * 
 * @param {Object} account - Dữ liệu của Account vừa được tạo.
 * @returns {Object} Transaction của số dư đầu kỳ.
 */
async function createDefaultTransaction(account) {
    try {
        const defaultTransactionInfo = {
            name: enumUtil.TransactionTypes.OPEN.translate,
            note: 'Tạo tự động từ hệ thống',
            amount: account.balance,
            userId: account.userId,
            accountId: account.id,
            transactionType: 'open'
        };

        const transaction = await transactionService.createTransaction(defaultTransactionInfo);
        return transaction;
    } catch (error) {
        console.error('Lỗi khi tạo Transaction mặc định:', error);
        throw error;
    }
}