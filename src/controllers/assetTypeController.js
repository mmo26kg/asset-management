const assetTypeService = require('../services/assetTypeService');
const deleteUtil = require('../utils/deleteUtil')


// Hàm để xử lý yêu cầu và gửi phản hồi
const handleServiceRequest = async (res, serviceMethod, successStatus = 200) => {
    try {
        const result = await serviceMethod();
        if (result === null) {
            return res.status(404).json({ error: 'Không tìm được loại tài sản' });
        }
        return res.status(successStatus).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller lấy tất cả các loại tài sản
exports.getAllAssetTypes = (req, res) => {
    handleServiceRequest(res, () => assetTypeService.getAllAssetTypes(req.query, req.listOptions));
};

// Controller lấy một loại tài sản theo ID
exports.getAssetTypeById = (req, res) => {
    handleServiceRequest(res, () => assetTypeService.getAssetTypeById(req.params.id));
};

// Controller tạo mới một loại tài sản
exports.createAssetType = (req, res) => {
    handleServiceRequest(res, () => assetTypeService.createAssetType(req.body), 201);
};

// Controller cập nhật một loại tài sản
exports.updateAssetType = (req, res) => {
    handleServiceRequest(res, () => assetTypeService.updateAssetType(req.params.id, req.body));
};

// Controller xóa một loại tài sản
exports.deleteAssetType = (req, res) => {
    handleServiceRequest(res, async () => {
        const deleted = await assetTypeService.deleteAssetType(req.params.id);
        return deleted ? null : false; // null để trả về 204 nếu xóa thành công
    }, 204);

    deleteUtil.handleDeleteService(
        () => assetTypeService.deleteAssetType(req.params.id, req.params.option, req.params.checkDetail), // Truyền hàm service xử lý xóa
        'đối tượng', // Tên của model để thông báo lỗi
        res // Đối tượng response
    );
};
