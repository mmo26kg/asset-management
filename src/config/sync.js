require('dotenv').config(); // Load các biến môi trường từ .env
const { sequelize } = require('./database'); // Đường dẫn tới file kết nối

const { Transaction, Account, Config, UserBalance, Category, AssetType, User, Stock, Currency } = require('../models/Associations'); // Đường dẫn tới các model của bạn

const syncDatabase = async () => {
    try {
        // Kiểm tra kết nối
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        // Đồng bộ tất cả các model
        await sequelize.sync({ force: true }); // Cảnh báo: force: true sẽ xóa các bảng nếu đã tồn tại
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to sync database:', error);
    } finally {
        await sequelize.close(); // Đóng kết nối sau khi hoàn tất
    }
};

syncDatabase();
