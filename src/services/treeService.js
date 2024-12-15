const TreeModel = require("tree-model");
const { getUserBalanceById, updateUserBalance } = require("./userBalanceService");
const { UserBalance, Transaction } = require("../models");
const { getAssetTypeById } = require('./assetTypeService');
const categoryService = require('./categoryService');
const { getAccountById } = require('./accountService');
const { getUserById } = require("./userService");

function findNode(balanceTree, key, value) {
    return balanceTree.first((node) => node.model[key] === value) || null;
}

//  * 📘 Lấy User Balance và parse thành Node.

async function fetchAndParseUserBalances(userId, balanceType, extraDataFunc = () => ({})) {
    const userBalances = await UserBalance.findAll({ where: { userId, balanceType } });
    if (!userBalances.length) throw new Error(`Không tìm thấy User Balance cho loại: ${balanceType}`);
    return await Promise.all(userBalances.map(async ub => ({
        id: ub.dataValues.id,
        nodeType: 'User Balance',
        balanceType: ub.dataValues.balanceType,
        balance: Number(ub.dataValues.balance),
        ...await extraDataFunc(ub)
    })));
}

async function fetchAndParseTransaction(userId) {
    const transaction = await Transaction.findAll({ where: { userId } });
    if (!transaction.length) throw new Error(`Không tìm thấy Transaction nào cho user: `, userId);
    return transaction.map(item => ({
        id: item.id,
        nodeType: 'Transaction',
        name: item.name,
        amount: Number(item.amount),
        currency: item.currency,
        transactionType: item.transactionType,
        accountId: item.accountId,
    }));
}


//  * 📘 Gắn UserBalance, Category hoặc Account vào cây.

function attachToTree(items, balanceTree, itemType) {
    let queue = [...items];
    let retryCount = 0;
    const maxRetries = items.length * 2;

    while (queue.length > 0 && retryCount < maxRetries) {
        const item = queue.shift();
        const node = new TreeModel().parse(item);
        let parentNode = null;

        // Xử lý cho User Balance: thêm vào balanceTree trực tiếp
        if (itemType === 'userBalance') {
            balanceTree.addChild(node);
        }

        // Xử lý cho Category: tìm cha bằng assetTypeId hoặc parentId
        else if (itemType === 'category') {
            const { assetTypeId, parentId, categoryId } = item;
            if (assetTypeId) {
                parentNode = findNode(balanceTree, 'assetTypeId', assetTypeId);
            } else if (parentId) {
                parentNode = findNode(balanceTree, 'categoryId', parentId);
            }
            if (parentNode) {
                parentNode.addChild(node);
            } else {
                queue.push(item); // Chưa tìm thấy, đẩy lại vào queue để thử lại sau
                retryCount++;
            }
        }

        // Xử lý cho Account: tìm cha bằng categoryId
        else if (itemType === 'account') {
            const { categoryId } = item;
            parentNode = findNode(balanceTree, 'categoryId', categoryId);

            if (parentNode) {
                parentNode.addChild(node);
            } else {
                console.warn('Không tìm thấy category để gắn account:', item);
            }
        }

        // Xử lý cho Transaction: tìm cha bằng accountId
        else if (itemType === "transaction") {
            const { accountId } = item;
            parentNode = findNode(balanceTree, 'accountId', accountId);

            if (parentNode) {
                parentNode.addChild(node);
            } else {
                console.warn('Không tìm thấy account để gắn transaction: ', item);
            }
        }
    }

    // Cảnh báo nếu có phần tử không gắn được
    if (queue.length > 0) {
        console.warn(`⚠️ Các ${itemType} không gắn được:`, queue.map(item => item.id));
    }
}


//  * 📘 Lấy AssetType bổ sung cho User Balance.

async function getAssetTypeExtraData(userBalance) {
    const assetType = await getAssetTypeById(userBalance.dataValues.assetTypeId);
    return { assetTypeId: userBalance.dataValues.assetTypeId, assetTypeName: assetType?.dataValues?.name || 'N/A' };
}


//  * 📘 Lấy Category bổ sung cho User Balance.

async function getCategoryExtraData(userBalance) {
    const category = await categoryService.getCategoryById(userBalance.dataValues.categoryId);
    return {
        categoryId: userBalance.dataValues.categoryId,
        categoryName: category?.dataValues?.name || 'N/A',
        assetTypeId: category?.dataValues?.assetTypeId || null,
        parentId: category?.dataValues?.parentId || null
    };
}

async function getAccountExtraData(userBalance) {
    const account = await getAccountById(userBalance.dataValues.accountId);
    return {
        accountId: account.dataValues.id,
        accountName: account?.dataValues?.name || 'N/A',
        categoryId: account?.dataValues?.categoryId
    };
}

exports.buildBalanceTreeForUser = async (userId) => {
    const user = await getUserById(userId);
    const balanceTree = new TreeModel().parse({
        nodeType: 'User',
        id: user.id,
        name: user.name,
        username: user.username
    });


    try {
        // Tạo các User Balance Nodes và gắn vào cây
        const [assetUB] = await fetchAndParseUserBalances(userId, 'asset');
        const assetUBNode = new TreeModel().parse(assetUB);
        balanceTree.addChild(assetUBNode);

        // Tạo AssetType User Balance Nodes
        const assetTypeUBs = await fetchAndParseUserBalances(userId, 'assetType', getAssetTypeExtraData);
        attachToTree(assetTypeUBs, assetUBNode, 'userBalance');

        // Tạo Category User Balance Nodes
        const categoryUBs = await fetchAndParseUserBalances(userId, 'category', getCategoryExtraData);
        attachToTree(categoryUBs, balanceTree, 'category');

        // Tạo Account User Balance Nodes
        const accountUBs = await fetchAndParseUserBalances(userId, 'account', getAccountExtraData);
        attachToTree(accountUBs, balanceTree, 'account');

        const transactions = await fetchAndParseTransaction(userId);
        attachToTree(transactions, balanceTree, 'transaction');

        // console.log('🌲 Cấu trúc cây tài sản của User:');
        // console.dir(balanceTree.model, { depth: null });

        return balanceTree



    } catch (error) {
        console.error('❌ Lỗi trong quá trình xây dựng cây User Balance:', error);
    }
};


function totalBalanceOfAnyNodeUB(node) {
    const transactionNodes = node.all(n => n.model.nodeType == 'Transaction');
    const totalBalance = transactionNodes.reduce((total, n) => total + Number(n.model.amount), 0);
    return totalBalance;
}

async function updateUBNodes(balanceTree, balanceType) {

    const userBalanceNodes = balanceTree.all((node) =>
        node.model.nodeType === 'User Balance' &&
        node.model.balanceType === balanceType
    )
    for (const node of userBalanceNodes) {
        const totalBalance = totalBalanceOfAnyNodeUB(node);
        node.model.balance = totalBalance;
        const userBalance = await getUserBalanceById(node.model.id);
        await updateUserBalance(userBalance.dataValues.id, {
            balance: totalBalance
        })

    }

};

exports.updateRelatedUBbyTransaction = async (transaction) => {
    userId = transaction.userId;
    const balanceTree = await this.buildBalanceTreeForUser(userId);

    ['account', 'category', 'assetType', 'asset'].forEach(balanceType => updateUBNodes(balanceTree, balanceType));

    // console.dir(balanceTree.model, { depth: null });

}