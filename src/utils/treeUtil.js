const TreeModel = require("tree-model");
const { UserBalance, Transaction, User, Account, AssetType, Category } = require("../models");

function findNode(balanceTree, key, value) {
    return balanceTree.first((node) => node.model[key] === value) || null;
}

// 📘 Lấy User Balance và parse thành Node
async function fetchAndParseUserBalances(userId, balanceType, extraDataFunc = () => ({})) {
    const userBalances = await UserBalance.findAll({ where: { userId, balanceType } });
    if (!userBalances.length) throw new Error(`Không tìm thấy User Balance cho loại: ${balanceType}`);
    return await Promise.all(userBalances.map(async ub => ({
        id: ub.id,
        nodeType: 'User Balance',
        balanceType: ub.balanceType,
        balance: Number(ub.balance),
        ...await extraDataFunc(ub)
    })));
}

async function fetchAndParseTransaction(userId) {
    const transactions = await Transaction.findAll({ where: { userId } });
    if (!transactions.length) throw new Error(`Không tìm thấy Transaction nào cho user: ${userId}`);
    return transactions.map(item => ({
        id: item.id,
        nodeType: 'Transaction',
        name: item.name,
        amount: Number(item.amount),
        currency: item.currency,
        transactionType: item.transactionType,
        accountId: item.accountId,
    }));
}

// 📘 Gắn UserBalance, Category hoặc Account vào cây
function attachToTree(items, balanceTree, itemType) {
    let queue = [...items];
    // let noParent = [];

    while (queue.length > 0) {
        const item = queue.shift();
        const node = new TreeModel().parse(item);
        let parentNode = null;

        if (itemType === 'assetType') {
            balanceTree.addChild(node);
        } else if (itemType === 'category') {
            const { assetTypeId, parentId } = item;
            parentNode = assetTypeId
                ? findNode(balanceTree, 'assetTypeId', assetTypeId)
                : findNode(balanceTree, 'categoryId', parentId);
        } else if (itemType === 'account') {
            parentNode = findNode(balanceTree, 'categoryId', item.categoryId);
        } else if (itemType === "transaction") {
            parentNode = findNode(balanceTree, 'accountId', item.accountId);
        }

        if (parentNode) {
            parentNode.addChild(node);
        } else {
            const noParentNode = findNode(balanceTree, 'nodeType', 'NoParent');
            if (noParentNode) {
                noParentNode.addChild(node);
            } else {
                console.error(`Không tìm thấy parent node để gắn item:`, item);
            }
        }
    }
    // noParent.length > 0
    // , noParent.map(item => item.model.id)
    if (true) {
        console.warn(`⚠️ Các ${itemType} không gắn được:`);
    }
}

// 📘 Lấy AssetType bổ sung cho User Balance
async function getAssetTypeExtraData(userBalance) {
    const assetType = await AssetType.findByPk(userBalance.assetTypeId);
    return {
        assetTypeId: userBalance.assetTypeId,
        assetTypeName: assetType?.name || 'N/A'
    };
}

// 📘 Lấy Category bổ sung cho User Balance
async function getCategoryExtraData(userBalance) {
    const category = await Category.findByPk(userBalance.categoryId);
    return {
        categoryId: userBalance.categoryId,
        categoryName: category?.name || 'N/A',
        assetTypeId: category?.assetTypeId || null,
        parentId: category?.parentId || null
    };
}

// 📘 Lấy Account bổ sung cho User Balance
async function getAccountExtraData(userBalance) {
    const account = await Account.findByPk(userBalance.accountId);
    return {
        accountId: account?.id,
        accountName: account?.name || 'N/A',
        categoryId: account?.categoryId
    };
}

exports.buildBalanceTreeForUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User không tồn tại');

    const balanceTree = new TreeModel().parse({
        nodeType: 'User',
        id: user.id,
        name: user.name,
        username: user.username
    });

    const noParentNode = new TreeModel().parse({
        nodeType: 'NoParent',
        balance: 0,
    });

    balanceTree.addChild(noParentNode);

    try {
        const [assetUB] = await fetchAndParseUserBalances(userId, 'asset');
        const assetUBNode = new TreeModel().parse(assetUB);
        balanceTree.addChild(assetUBNode);

        const assetTypeUBs = await fetchAndParseUserBalances(userId, 'assetType', getAssetTypeExtraData);
        attachToTree(assetTypeUBs, assetUBNode, 'assetType');

        const categoryUBs = await fetchAndParseUserBalances(userId, 'category', getCategoryExtraData);

        attachToTree(categoryUBs, balanceTree, 'category');

        const accountUBs = await fetchAndParseUserBalances(userId, 'account', getAccountExtraData);
        attachToTree(accountUBs, balanceTree, 'account');

        const transactions = await fetchAndParseTransaction(userId);
        attachToTree(transactions, balanceTree, 'transaction');

        return balanceTree;

    } catch (error) {
        console.error('❌ Lỗi trong quá trình xây dựng cây User Balance:', error);
    }
};

function totalBalanceOfAnyNodeUB(node) {
    const transactionNodes = node.all(n => n.model.nodeType === 'Transaction');
    return transactionNodes.reduce((total, n) => total + Number(n.model.amount), 0);

}

async function updateUBNodes(balanceTree, balanceType) {
    const userBalanceNodes = balanceTree.all(node =>
        node.model.nodeType === 'User Balance' &&
        node.model.balanceType === balanceType
    );

    for (const node of userBalanceNodes) {
        const totalBalance = totalBalanceOfAnyNodeUB(node);
        node.model.balance = totalBalance;
        await UserBalance.update(
            { balance: totalBalance },
            { where: { id: node.model.id } }
        );
    }
}

exports.updateUserUB = async (userId) => {
    const balanceTree = await this.buildBalanceTreeForUser(userId);
    const balanceTypes = ['account', 'category', 'assetType', 'asset'];

    for (const balanceType of balanceTypes) {
        await updateUBNodes(balanceTree, balanceType);
    }
    console.dir(balanceTree.model, { depth: null });
}