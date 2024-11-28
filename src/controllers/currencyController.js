const currencyService = require('../services/currencyService');
const deleteUtil = require('../utils/deleteUtil')

// Hàm để xử lý yêu cầu và gửi phản hồi
const handleServiceRequest = async (res, serviceMethod, successStatus = 200) => {
    try {
        const result = await serviceMethod();
        if (result === null) {
            return res.status(404).json({ error: 'Không tìm được loại tiền tệ' });
        }
        return res.status(successStatus).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller lấy tất cả các loại tiền tệ
exports.getAllCurrencies = (req, res) => {
    handleServiceRequest(res, () => currencyService.getAllCurrencies(req.query, req.listOptions));
};

// Controller lấy một loại tiền tệ theo ID
exports.getCurrencyById = (req, res) => {
    handleServiceRequest(res, () => currencyService.getCurrencyById(req.params.id));
};

// Controller tạo mới một loại tiền tệ
exports.createCurrency = (req, res) => {
    handleServiceRequest(res, () => currencyService.createCurrency(req.body), 201);
};

// Controller cập nhật một loại tiền tệ
exports.updateCurrency = (req, res) => {
    handleServiceRequest(res, () => currencyService.updateCurrency(req.params.id, req.body));
};

// Controller xóa một loại tiền tệ
exports.deleteCurrency = (req, res) => {
    deleteUtil.handleDeleteService(
        () => currencyService.deleteCurrency(req.params.id, req.params.option, req.params.checkDetail), // Truyền hàm service xử lý xóa
        'đối tượng', // Tên của model để thông báo lỗi
        res // Đối tượng response
    );
};
