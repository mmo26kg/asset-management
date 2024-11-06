const express = require('express');
const app = express();
const routes = require('./routes'); // Import file index.js từ thư mục routes
// const transactionRoutes = require('./routes/transactionRoutes');

app.use(express.json());
// app.use('/api/transactions', transactionRoutes);
app.use('/api', routes);

module.exports = app;
