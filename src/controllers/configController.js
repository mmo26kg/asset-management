const configService = require('../services/configService');

// Hàm để xử lý yêu cầu và gửi phản hồi
const handleServiceRequest = async (res, serviceMethod, successStatus = 200) => {
    try {
        const result = await serviceMethod();
        if (result === null) {
            return res.status(404).json({ error: 'Không tìm được cấu hình' });
        }
        return res.status(successStatus).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller lấy tất cả các cấu hình
exports.getAllConfigs = (req, res) => {
    handleServiceRequest(res, () => configService.getAllConfigs(req.query));
};

// Controller lấy một cấu hình theo ID
exports.getConfigById = (req, res) => {
    handleServiceRequest(res, () => configService.getConfigById(req.params.id));
};

// Controller tạo mới một cấu hình
exports.createConfig = (req, res) => {
    handleServiceRequest(res, () => configService.createConfig(req.body), 201);
};

// Controller cập nhật một cấu hình
exports.updateConfig = (req, res) => {
    handleServiceRequest(res, () => configService.updateConfig(req.params.id, req.body));
};

// Controller xóa một cấu hình
exports.deleteConfig = (req, res) => {
    handleServiceRequest(res, async () => {
        const deleted = await configService.deleteConfig(req.params.id);
        return deleted ? null : false; // null để trả về 204 nếu xóa thành công
    }, 204);
};
