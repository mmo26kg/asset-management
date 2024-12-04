const { Account } = require('../models');
const userBalanceService = require('../services/userBalanceService');
const transactionService = require('../services/transactionService');
const enumUtil = require('../utils/enumUtil'); // Import sequelize
const { Transaction } = require('../models');



exports.afterCreate = async (account) => {

    const createAccountUB = async () => {
        const accountUB = await userBalanceService.createUserBalance({
            balanceType: 'account',
            userId: account.userId,
            accountId: account.id
        });
        // console.log('Account UB ', accountUB.dataValues);
        return accountUB;

    };

    const createDefaultTransaction = async () => {
        const defaultTransacionInfo = {
            name: enumUtil.TransactionTypes.OPEN.translate,
            note: 'Tạo tự động từ hệ thống',
            amount: account.balance,
            userId: account.userId,
            accountId: account.id,
            transactionType: 'open',

        };
        const transaction = await transactionService.createTransaction(defaultTransacionInfo);
        // console.log('A :', defaultTransacionInfo);

        console.log('Transaction số dư đầu kỳ đã được tạo :', transaction.dataValues);
    };



    try {
        const accountUB = await createAccountUB();
        const defaultTransacion = await createDefaultTransaction();
    } catch (error) {
        throw error;
    }

}