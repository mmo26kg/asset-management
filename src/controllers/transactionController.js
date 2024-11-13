const transactionService = require('../services/transactionService');

// Hàm để xử lý yêu cầu và gửi phản hồi
const handleServiceRequest = async (res, serviceMethod, successStatus = 200) => {
    try {
        const result = await serviceMethod();
        if (result === null) {
            return res.status(404).json({ error: 'Không tìm được giao dịch' });
        }
        return res.status(successStatus).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller lấy tất cả các giao dịch
exports.getAllTransactions = (req, res) => {
    handleServiceRequest(res, () => transactionService.getAllTransactions());
};

// Controller lấy một giao dịch theo ID
exports.getTransactionById = (req, res) => {
    handleServiceRequest(res, () => transactionService.getTransactionById(req.params.id));
};

// Controller tạo mới một giao dịch
exports.createTransaction = (req, res) => {
    handleServiceRequest(res, () => transactionService.createTransaction(req.body), 201);
};

// Controller cập nhật một giao dịch
exports.updateTransaction = (req, res) => {
    handleServiceRequest(res, () => transactionService.updateTransaction(req.params.id, req.body));
};

// Controller xóa một giao dịch
exports.deleteTransaction = (req, res) => {
    handleServiceRequest(res, async () => {
        const deleted = await transactionService.deleteTransaction(req.params.id);
        return deleted ? null : false; // null để trả về 204 nếu xóa thành công
    }, 204);
};
