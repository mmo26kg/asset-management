const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database'); // Đường dẫn tới file kết nối

const runSeed = async () => {
    try {
        const sqlFilePath = path.join(__dirname, 'drop.sql'); // Đường dẫn tới file seed.sql
        const sql = fs.readFileSync(sqlFilePath, 'utf8'); // Đọc nội dung file

        await sequelize.sync(); // Đồng bộ hóa các model nếu cần
        await sequelize.query(sql); // Thực thi các câu lệnh SQL
        console.log('Drop data successfully.');
    } catch (error) {
        console.error('Error inserting seed data:', error);
    } finally {
        await sequelize.close(); // Đóng kết nối
    }
};

runSeed();
