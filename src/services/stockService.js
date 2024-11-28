const { Stock } = require('../models');
const deleteUtil = require('../utils/deleteUtil');


// Lấy tất cả các cổ phiếu
exports.getAllStocks = async (queryConditions, listOptions) => {
    const result = await Stock.findAndCountAll({
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

// Lấy một cổ phiếu theo ID
exports.getStockById = async (id) => {
    return await Stock.findByPk(id);
};

// Tạo mới một cổ phiếu
exports.createStock = async (data) => {
    return await Stock.create(data);
};

// Cập nhật một cổ phiếu theo ID
exports.updateStock = async (id, data) => {
    const stock = await Stock.findByPk(id);
    if (!stock) return null;
    await stock.update(data);
    return stock;
};

// Xóa một cổ phiếu theo ID
exports.deleteStock = async (id, option, checkDetail) => {
    const constraints = deleteUtil.StockDeleteConstraint;
    return await deleteUtil.deleteService(Stock, id, constraints, option, checkDetail);
};
