const { Stock } = require('../models');

// Lấy tất cả các cổ phiếu
exports.getAllStocks = async () => {
    return await Stock.findAll();
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
exports.deleteStock = async (id) => {
    const stock = await Stock.findByPk(id);
    if (!stock) return null;
    await stock.destroy();
    return true;
};
