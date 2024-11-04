require('dotenv').config(); // Load các biến môi trường từ .env
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT
};

const databaseName = process.env.DB_NAME;

const sequelize = new Sequelize(databaseName, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port
});

async function initializeDatabase() {
    try {
        // Tạo kết nối không bao gồm tên database
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port
        });

        // Kiểm tra và tạo database nếu chưa tồn tại
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
        console.log(`Database "${databaseName}" checked/created successfully.`);
        await connection.end();

        // Kiểm tra kết nối
        await sequelize.authenticate();
        console.log(`Connection to the database "${databaseName}" has been established successfully.`);

        // Đồng bộ tất cả các model
        await sequelize.sync({ force: true });
        console.log(`Database "${databaseName}" synchronized successfully.`);

    } catch (error) {
        console.error('Error setting up the database:', error);
        throw error; // Ném lỗi để có thể xử lý ở nơi khác
    }
}

// Xuất sequelize và hàm khởi tạo
module.exports = {
    initializeDatabase,
    sequelize
};
