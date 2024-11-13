const accountService = require('../services/accountService');

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
    handleServiceRequest(res, () => accountService.getAllAccounts());
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

// Controller xóa một tài khoản
exports.deleteAccount = (req, res) => {
    handleServiceRequest(res, async () => {
        const deleted = await accountService.deleteAccount(req.params.id);
        return deleted ? null : false; // null để trả về 204 nếu xóa thành công
    }, 204);
};
