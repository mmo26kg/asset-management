const express = require('express');
const app = express();
// const transactionRoutes = require('./routes/transactionRoutes');

app.use(express.json());
// app.use('/api/transactions', transactionRoutes);

module.exports = app;
