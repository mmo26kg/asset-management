const { updateRelatedUBbyTransaction } = require('../services/treeService');
const userBalanceService = require('../services/userBalanceService');


exports.afterCreate = async (transaction) => {
    await updateRelatedUBbyTransaction(transaction);
};