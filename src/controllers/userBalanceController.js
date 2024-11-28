const userBalanceService = require('../services/userBalanceService');
const deleteUtil = require('../utils/deleteUtil')


// Hàm để xử lý yêu cầu và gửi phản hồi
const handleServiceRequest = async (res, serviceMethod, successStatus = 200) => {
    try {
        const result = await serviceMethod();
        if (result === null) {
            return res.status(404).json({ error: 'Không tìm được số dư người dùng' });
        }
        return res.status(successStatus).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller lấy tất cả số dư người dùng
exports.getAllUserBalances = (req, res) => {
    handleServiceRequest(res, () => userBalanceService.getAllUserBalances(req.query, req.listOptions));
};

// Controller lấy một số dư người dùng theo ID
exports.getUserBalanceById = (req, res) => {
    handleServiceRequest(res, () => userBalanceService.getUserBalanceById(req.params.id, req.listOptions));
};

// Controller tạo mới một số dư người dùng
exports.createUserBalance = (req, res) => {
    handleServiceRequest(res, () => userBalanceService.createUserBalance(req.body), 201);
};

// Controller cập nhật một số dư người dùng
exports.updateUserBalance = (req, res) => {
    handleServiceRequest(res, () => userBalanceService.updateUserBalance(req.params.id, req.body));
};

// Controller xóa một số dư người dùng
exports.deleteUserBalance = (req, res) => {
    deleteUtil.handleDeleteService(
        () => userBalanceService.deleteUserBalance(req.params.id, req.params.option, req.params.checkDetail), // Truyền hàm service xử lý xóa
        'đối tượng', // Tên của model để thông báo lỗi
        res // Đối tượng response
    );
};
