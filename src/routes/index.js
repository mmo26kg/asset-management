const express = require('express');
const models = require('../models')

const categoryRoute = require('./categoryRoute'); // Import route của Category
const configRoute = require('./configRoute'); // Import route của Category
const transactionRoute = require('./transactionRoute'); // Import route của Category
const accountRoute = require('./accountRoute'); // Import route của Category
const assetTypeRoute = require('./assetTypeRoute'); // Import route của Category
const currencyRoute = require('./currencyRoute'); // Import route của Category
const stockRoute = require('./stockRoute'); // Import route của Category
const userRoute = require('./userRoute'); // Import route của Category
const userBalanceRoute = require('./userBalanceRoute'); // Import route của Category
const testFunction = require('../utils/testFunctionUtil'); // Import route của Category
const imageRoute = require('./imageRoute'); // Import route của Category
const { createSampleData } = require('../systemMasterData/assetType&Category');
const { getAssetTypeCategoryTree } = require('../systemMasterData/assetType&Category');


const router = express.Router();

// Sử dụng các route
router.use('/categories', categoryRoute); // Định nghĩa route cho Category
router.use('/configs', configRoute); // Định nghĩa route cho Category
router.use('/transactions', transactionRoute); // Định nghĩa route cho Category
router.use('/accounts', accountRoute); // Định nghĩa route cho Category
router.use('/assetTypes', assetTypeRoute); // Định nghĩa route cho Category
router.use('/currencies', currencyRoute); // Định nghĩa route cho Category
router.use('/stocks', stockRoute); // Định nghĩa route cho Category
router.use('/users', userRoute); // Định nghĩa route cho Category
router.use('/userBalances', userBalanceRoute); // Định nghĩa route cho Category
router.use('/images', imageRoute); // Định nghĩa route cho Category
router.use('/testFunction', testFunction); // Định nghĩa route cho Category
router.post('/seed', async (req, res) => {
    try {

        const result = await createSampleData();
        const result2 = await getAssetTypeCategoryTree();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo dữ liệu seed', error: error.message });
    }
});


module.exports = router;
