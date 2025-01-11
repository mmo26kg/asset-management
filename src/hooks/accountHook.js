// ================== Import các service và model liên quan ==================
const { Account, Transaction } = require('../models');
const userBalanceService = require('../services/userBalanceService');
const transactionService = require('../services/transactionService');
const categoryService = require('../services/categoryService');
const enumUtil = require('../utils/enumUtil'); // Import các hàm tiện ích Enum
const { updateUserUB } = require('../utils/treeUtil');

// ================== Hàm chính xử lý afterCreate của Account ==================
/**
 * Hàm xử lý logic sau khi một tài khoản (Account) được tạo.
 * 
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
        await createAccountUserBalance(account);

        // === 2. Tạo UserBalance cho các Category liên quan ===
        const { assetTypeId } = await createCategoryUserBalances(account.userId, account.categoryId);

        // === 3. Tạo UserBalance cho AssetType liên quan ===
        if (assetTypeId) {
            await createAssetTypeUserBalance(account.userId, assetTypeId);
        } else {
            console.warn('Không xác định được AssetType liên quan đến Account.');
        }

        // === 4. Tạo Transaction số dư đầu kỳ cho Account ===
        const defaultTransaction = await createDefaultTransaction(account);
        console.log('Transaction số dư đầu kỳ đã được tạo:', defaultTransaction.dataValues);

    } catch (error) {
        console.error('Lỗi trong quá trình xử lý afterCreate:', error);
        throw error;
    }
};



// ================== Nhóm hàm tiện ích hỗ trợ xử lý afterCreate ==================

/**
 * Tạo UserBalance cho Account.
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
        return accountUserBalance;
    } catch (error) {
        console.error('Lỗi khi tạo UserBalance cho Account:', error);
        throw error;
    }
}

/**
 * Tạo UserBalance cho các Category liên quan, bao gồm cả các Category cấp cha.
 * 
 * @param {number} userId - ID của User.
 * @param {number} categoryId - ID của Category hiện tại.
 * @returns {Object} - Trả về danh sách UserBalance của các Category và AssetTypeId.
 */
async function createCategoryUserBalances(userId, categoryId) {
    const queue = [categoryId]; // Hàng đợi để xử lý các Category
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
            if (!currentCategory) throw new Error('Category không tồn tại');

            const parentCategoryId = currentCategory.parentId;

            // Nếu có category cha, thêm vào hàng đợi để xử lý tiếp
            if (parentCategoryId) {
                queue.push(parentCategoryId);
            } else {
                assetTypeId = currentCategory.assetTypeId; // Gán AssetTypeId khi gặp Category gốc
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

        // const transaction = await transactionService.createTransaction(defaultTransactionInfo);
        const transaction = await Transaction.create(defaultTransactionInfo);
        await updateUserUB(transaction.userId);
        return transaction;
    } catch (error) {
        console.error('Lỗi khi tạo Transaction mặc định:', error);
        throw error;
    }
}


exports.afterUpdate = async (account, data, updateCategory) => {
    console.log('Update Category :', updateCategory);
    console.log('Data :', data.categoryId);
    console.log('Account :', account.dataValues.categoryId);
    try {
        if (updateCategory) {
            const userId = account.userId;
            await updateUserUB(userId);
            return
        }
        console.log('Không cần update cây balance');
    } catch (error) {
        console.error('Lỗi khi xử lý afterUpdate:', error);
        throw error;
    }
}