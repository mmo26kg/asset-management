const accountService = require('../services/accountService');
const deleteUtil = require('../utils/deleteUtil')

// Hàm để xử lý yêu cầu và gửi phản hồi
const handleServiceRequest = async (res, serviceMethod, successStatus = 200) => {
    try {
        const result = await serviceMethod();
        if (result === null) {
            return res.status(404).json({ error: 'Không tìm được tài khoản' });
        }
        return res.status(successStatus).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller lấy tất cả các tài khoản
exports.getAllAccounts = (req, res) => {
    handleServiceRequest(res, () => accountService.getAllAccounts(req.query, req.listOptions));
};

// Controller lấy tất cả các tài khoản
exports.getAllMyAccounts = (req, res) => {
    handleServiceRequest(res, () => accountService.getAllMyAccounts(req.query, req.user, req.listOptions));
};

// Controller lấy tất cả các tài khoản
exports.getAllMyAccountsByAssetType = (req, res) => {
    handleServiceRequest(res, () => accountService.getAllMyAccountsByAssetType(req.query, req.user, req.params.assetTypeId, req.listOptions));
};

// Controller lấy một tài khoản theo ID
exports.getAccountById = (req, res) => {
    handleServiceRequest(res, () => accountService.getAccountById(req.params.id));
};

// Controller tạo mới một tài khoản
exports.createAccount = (req, res) => {
    handleServiceRequest(res, () => accountService.createAccount(req.body), 201);
};

// Controller cập nhật một tài khoản
exports.updateAccount = (req, res) => {
    handleServiceRequest(res, () => accountService.updateAccount(req.params.id, req.body));
};



exports.deleteAccount = async (req, res) => {
    deleteUtil.handleDeleteService(
        () => accountService.deleteAccount(req.params.id, req.params.option, req.params.checkDetail), // Truyền hàm service xử lý xóa
        'đối tượng', // Tên của model để thông báo lỗi
        res // Đối tượng response
    );
};