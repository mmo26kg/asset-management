const { Currency } = require('../models');

// Lấy tất cả các loại tiền tệ
exports.getAllCurrencies = async () => {
    return await Currency.findAll();
};

// Lấy một loại tiền tệ theo ID
exports.getCurrencyById = async (id) => {
    return await Currency.findByPk(id);
};

// Tạo mới một loại tiền tệ
exports.createCurrency = async (data) => {
    return await Currency.create(data);
};

// Cập nhật một loại tiền tệ theo ID
exports.updateCurrency = async (id, data) => {
    const currency = await Currency.findByPk(id);
    if (!currency) return null;
    await currency.update(data);
    return currency;
};

// Xóa một loại tiền tệ theo ID
exports.deleteCurrency = async (id) => {
    const currency = await Currency.findByPk(id);
    if (!currency) return null;
    await currency.destroy();
    return true;
};
