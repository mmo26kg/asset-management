const stockService = require('../services/stockService');
const deleteUtil = require('../utils/deleteUtil')


// Hàm để xử lý yêu cầu và gửi phản hồi
const handleServiceRequest = async (res, serviceMethod, successStatus = 200) => {
    try {
        const result = await serviceMethod();
        if (result === null) {
            return res.status(404).json({ error: 'Không tìm thấy cổ phiếu' });
        }
        return res.status(successStatus).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller lấy tất cả các cổ phiếu
exports.getAllStocks = (req, res) => {
    handleServiceRequest(res, () => stockService.getAllStocks(req.query, req.listOptions));
};

// Controller lấy một cổ phiếu theo ID
exports.getStockById = (req, res) => {
    handleServiceRequest(res, () => stockService.getStockById(req.params.id));
};

// Controller tạo mới một cổ phiếu
exports.createStock = (req, res) => {
    handleServiceRequest(res, () => stockService.createStock(req.body), 201);
};

// Controller cập nhật một cổ phiếu
exports.updateStock = (req, res) => {
    handleServiceRequest(res, () => stockService.updateStock(req.params.id, req.body));
};

// Controller xóa một cổ phiếu
exports.deleteStock = (req, res) => {
    deleteUtil.handleDeleteService(
        () => stockService.deleteStock(req.params.id, req.params.option, req.params.checkDetail), // Truyền hàm service xử lý xóa
        'đối tượng', // Tên của model để thông báo lỗi
        res // Đối tượng response
    );
};
