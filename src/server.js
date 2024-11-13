const express = require('express');
const { initializeDatabase } = require('./config/database'); // Sử dụng trực tiếp initializeDatabase và sequelize nếu cần
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

async function startServer() {
    try {
        await initializeDatabase(); // Khởi tạo và đồng bộ database
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
}

startServer();
