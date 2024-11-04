const app = require('./app');
const sequelize = require('./config/database');
const initializeDatabase = require('./config/database').initializeDatabase; // Import hàm khởi tạo

const PORT = process.env.PORT || 3000;


async function startServer() {
    const sequelize = await initializeDatabase();

    // Kiểm tra kết nối cơ sở dữ liệu
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    // Khởi động server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer();