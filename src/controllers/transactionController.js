const transactionService = require('../services/transactionService');
const deleteUtil = require('../utils/deleteUtil')


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
    handleServiceRequest(res, () => transactionService.getAllTransactions(req.query, req.listOptions));
};


// Controller lấy tất cả các giao dịch
exports.getAllMyTransactions = (req, res) => {
    handleServiceRequest(res, () => transactionService.getAllMyTransactions(req.query, req.user, req.listOptions));
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
    deleteUtil.handleDeleteService(
        () => transactionService.deleteTransaction(req.params.id, req.params.option, req.params.checkDetail), // Truyền hàm service xử lý xóa
        'đối tượng', // Tên của model để thông báo lỗi
        res // Đối tượng response
    );
};
