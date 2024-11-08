const express = require('express');
const categoryRoute = require('./categoryRoute'); // Import route của Category
const configRoute = require('./configRoute'); // Import route của Category
// Import thêm các route khác nếu có, ví dụ:
// const userRoutes = require('./userRoutes');

const router = express.Router();

// Sử dụng các route
router.use('/categories', categoryRoute); // Định nghĩa route cho Category
router.use('/configs', configRoute); // Định nghĩa route cho Category

// Định nghĩa thêm các route khác nếu có
// router.use('/users', userRoutes);

module.exports = router;
