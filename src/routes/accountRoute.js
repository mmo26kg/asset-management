const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middlewares/authMiddleware');
const listOptionsMiddleware = require('../middlewares/listOptionsMiddleware');
const { Account } = require('../models');

// Định nghĩa các route cho các API
router.get('/', authMiddleware.checkSystemAdmin, listOptionsMiddleware, accountController.getAllAccounts);          // Lấy tất cả các tài khoản
router.get('/me', authMiddleware.checkLogin, listOptionsMiddleware, accountController.getAllMyAccounts);          // Lấy tất cả các tài khoản
router.get('/me/:assetTypeId', authMiddleware.checkLogin, listOptionsMiddleware, accountController.getAllMyAccountsByAssetType);          // Lấy tất cả các tài khoản
router.get('/:id', authMiddleware.checkOwner(Account), accountController.getAccountById);       // Lấy một tài khoản theo ID
router.post('/', authMiddleware.checkLogin, accountController.createAccount);          // Tạo mới một tài khoản
router.put('/:id', authMiddleware.checkOwner(Account), accountController.updateAccount);        // Cập nhật một tài khoản
router.delete('/:id/:option?/:checkDetail?', authMiddleware.checkOwner(Account), accountController.deleteAccount);     // Xóa một tài khoản

module.exports = router;
