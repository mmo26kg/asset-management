const { updateUserUB } = require('../utils/treeUtil');


exports.afterCreate = async (transaction) => {
    await updateUserUB(transaction.userId);
};

exports.afterUpdate = async (transaction) => {
    await updateUserUB(transaction.userId);
};

exports.afterDelete = async (transaction) => {
    await updateUserUB(transaction.userId);
};