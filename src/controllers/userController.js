const userService = require('../services/userService');

// Hàm để xử lý yêu cầu và gửi phản hồi
const handleServiceRequest = async (res, serviceMethod, successStatus = 200) => {
    try {
        const result = await serviceMethod();
        if (result === null) {
            return res.status(404).json({ error: 'Không tìm được người dùng' });
        }
        return res.status(successStatus).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller lấy tất cả người dùng
exports.getAllUsers = (req, res) => {
    handleServiceRequest(res, () => userService.getAllUsers(req.query));
};

// Controller lấy một người dùng theo ID
exports.getUserById = (req, res) => {
    handleServiceRequest(res, () => userService.getUserById(req.params.id));
};

// Controller tạo mới một người dùng
exports.createUser = (req, res) => {
    handleServiceRequest(res, () => userService.createUser(req.body), 201);
};

// Controller cập nhật một người dùng
exports.updateUser = (req, res) => {
    handleServiceRequest(res, () => userService.updateUser(req.params.id, req.body));
};

// Controller xóa một người dùng
exports.deleteUser = (req, res) => {
    handleServiceRequest(res, async () => {
        const deleted = await userService.deleteUser(req.params.id);
        return deleted ? null : false; // null để trả về 204 nếu xóa thành công
    }, 204);
};
