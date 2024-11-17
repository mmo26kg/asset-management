require('dotenv').config();
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

// Khởi tạo đối tượng Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: true,
});

async function initializeDatabase() {
    try {
        // Kết nối và kiểm tra/tạo database nếu chưa tồn tại
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database "${process.env.DB_NAME}" checked/created successfully.`);
        await connection.end();

        // Kiểm tra và đồng bộ Sequelize với database
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync({alter: true});
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error setting up the database:', error);
        throw error;
    }
}

module.exports = { sequelize, initializeDatabase };
