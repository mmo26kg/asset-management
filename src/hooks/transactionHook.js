const userBalanceService = require('../services/userBalanceService');


exports.afterCreate = async (transaction) => {
    await userBalanceService.updateRelatedUBbyTransaction(transaction);
};