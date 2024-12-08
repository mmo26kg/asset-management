// UserBalanceService.js

const { UserBalance } = require('../models');
const deleteUtil = require('../utils/deleteUtil');
const TreeModel = require('tree-model');



//#region 1. API cơ bản

exports.getAllUserBalances = async (queryConditions, listOptions) => {
    const result = await UserBalance.findAndCountAll({
        where: { ...queryConditions, ...listOptions.whereCondition },
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

exports.getUserBalanceById = async (id) => await UserBalance.findByPk(id);

exports.createUserBalance = async (data) => {
    const existingUserBalance = await this.checkExistUserBalance(
        data.userId,
        data.balanceType,
        data.accountId || data.categoryId || data.assetTypeId
    );

    if (existingUserBalance) {
        return existingUserBalance;
    }

    return await UserBalance.create(data);
};

exports.updateUserBalance = async (id, data) => {
    const userBalance = await UserBalance.findByPk(id);
    if (!userBalance) throw new Error(`UserBalance không tồn tại với ID: ${id}`);
    return await userBalance.update(data);
};

exports.deleteUserBalance = async (id, option, checkDetail) => {
    const constraints = deleteUtil.UserBalanceDeleteConstraint;
    return await deleteUtil.deleteService(UserBalance, id, constraints, option, checkDetail);
};

//#endregion

//#region 2. API nâng cao
exports.checkExistUserBalance = async (userId, balanceType, referId) => {
    const condition = {
        userId,
        balanceType,
        ...(balanceType === 'account' && { accountId: referId }),
        ...(balanceType === 'category' && { categoryId: referId }),
        ...(balanceType === 'assetType' && { assetTypeId: referId }),
    };

    return await UserBalance.findOne({ where: condition });
};

exports.updateBalanceByUser = async (id, newBalance) => {
    try {
        const userBalance = await UserBalance.findByPk(id);

        if (!userBalance) throw new Error(`Không tìm thấy UserBalance với ID: ${id}`);
        return await userBalance.update({ balance: newBalance });
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật số dư cho UserBalance ID ${id}: ${error.message}`);
    }
};

exports.updateRelatedUBbyTransaction = async (transaction) => {
    const userId = transaction.userId;

    // const tree = new TreeModel();
    const userBusinessDataTree = new TreeModel();

    // userBusinessDataTree.parse(userBusinessData);
    const root = userBusinessDataTree.parse({
        name: 'User',
        id: userId
    })

    const assetUB = async (userId) => {
        try {
            // Trả về kết quả trực tiếp
            const userBalance = await UserBalance.findOne({
                where: {
                    userId: userId,
                    balanceType: 'asset',
                }
            });

            // Kiểm tra nếu không tìm thấy bản ghi
            if (!userBalance) {
                throw new Error('Asset User balance not found');
            }

            return {
                id: userBalance.dataValues.id,
                type: userBalance.dataValues.balanceType,
                balance: userBalance.balance
            };

        } catch (error) {
            // Xử lý lỗi nếu có
            console.error(error);
            throw error;  // Ném lại lỗi để xử lý ở nơi gọi hàm
        }
    }

    const assetUBNode = userBusinessDataTree.parse(await assetUB(userId));
    root.addChild(assetUBNode);

    const assetTypeUBs = async (userId) => {
        try {
            // Trả về kết quả trực tiếp
            const userBalances = await UserBalance.findAll({
                where: {
                    userId: userId,
                    balanceType: 'assetType',
                }
            });

            // Kiểm tra nếu không tìm thấy bản ghi
            if (userBalances.length == 0) {
                throw new Error('AssetType User balance not found');
            }


            return userBalances.map(a => ({
                id: a.dataValues.id,
                type: a.dataValues.balanceType,
                balance: a.dataValues.balance
            }));

        } catch (error) {
            // Xử lý lỗi nếu có
            console.error(error);
            throw error;  // Ném lại lỗi để xử lý ở nơi gọi hàm
        }
    }
    const assetTypeUBNodeData = await assetTypeUBs(userId);
    // console.log('A :', assetTypeUBNodeData);
    assetTypeUBNodeData.forEach(assetTypeUBData => {
        const assetTypeUBNode = userBusinessDataTree.parse(assetTypeUBData);
        // console.log('A :', assetTypeUBNode);
        assetUBNode.addChild(assetTypeUBNode);
    });


    console.log('In full cây tài sản');
    console.dir(root.model, { depth: null });



    // Tạo cấu trúc cây từ dữ liệu JSON
    // const root = tree.parse(treeData);

    // // 1. Duyệt cây và in ra các node
    // console.log('--- Duyệt cây và in các node ---');
    // root.walk(function (node) {
    //     console.log(node.model.name);
    // });

    // const getDescendantOfNode = (node) => {
    //     return node.all();
    // };

    // const nodeA = root.first(n => n.model.name.includes('Bất động sản'));
    // const childOfA = getDescendantOfNode(nodeA).map(n => {
    //     return { ...n.model };
    // }).filter(n => n.name.includes('Transaction'));
    // console.log('Các tập con của Phương tiện :', childOfA);





    // await this.syncAccountUB(transaction.accountId);
    // await this.syncCategoryUB(transaction);
};

exports.syncAccountUB = async (accountId) => {
    try {
        // const transactions = await transactionService.getAllTransactionAmountByAccount(accountId);

        if (!transactions || transactions.length === 0) {
            throw new Error(`Không có giao dịch nào cho accountId: ${accountId}`);
        }

        const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const userBalance = await UserBalance.findOne({ where: { accountId } });

        if (!userBalance) throw new Error(`Không tìm thấy UserBalance cho accountId: ${accountId}`);

        await userBalance.update({ balance: totalAmount });
    } catch (error) {
        throw new Error(`Lỗi khi đồng bộ số dư cho accountId ${accountId}: ${error.message}`);
    }
};

//#endregion

//#region 3. API dự phòng

exports.syncCategoryUB = (transaction) => {
    console.log('Tính toán Category User Balance của transaction:', transaction);

    // Lấy list tất cả các category liên quan tới transaction
    // Lấy account của transaction
    // Từ account, tìm ra được category đầu tiên
    // Tiếp tục tìm category theo parentId của category vừa tìm được cho đến khi tìm được tất cả (category cuối cùng không có parentId)
    // Lặp mảng category liên quan
    // Với mỗi category trong chuỗi, tìm kiếm UB tương ứng có tồn tại chưa
    // Nếu chưa thì cần tạo mới
    // Nếu có rồi thì cần chạy hàm cập nhật số dư UB
    // Xét 1 category
    // Cần lấy tất cả các category con
    // Lấy đến khi hết category con
    // Cần lấy thêm tất cả các account con


};

exports.syncAssetTypeUB = () => {
    throw new Error('Chức năng đồng bộ Asset Type UB chưa được triển khai.');
};

exports.syncAssetUB = () => {
    throw new Error('Chức năng đồng bộ Asset UB chưa được triển khai.');
};

//#endregion


