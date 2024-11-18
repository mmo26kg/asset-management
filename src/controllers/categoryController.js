const categoryService = require('../services/categoryService');

// Hàm để xử lý yêu cầu và gửi phản hồi
const handleServiceRequest = async (res, serviceMethod, successStatus = 200) => {
    try {
        const result = await serviceMethod();
        if (result === null) {
            return res.status(404).json({ error: 'Không tìm được danh mục' });
        }
        return res.status(successStatus).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller lấy tất cả các danh mục
exports.getAllCategories = (req, res) => {
    handleServiceRequest(res, () => categoryService.getAllCategories(req.query, req.sortOptions));
};

// Controller lấy một danh mục theo ID
exports.getCategoryById = (req, res) => {
    handleServiceRequest(res, () => categoryService.getCategoryById(req.params.id));
};

// Controller tạo mới một danh mục
exports.createCategory = (req, res) => {
    handleServiceRequest(res, () => categoryService.createCategory(req.body), 201);
};

// Controller cập nhật một danh mục
exports.updateCategory = (req, res) => {
    handleServiceRequest(res, () => categoryService.updateCategory(req.params.id, req.body));
};

// Controller xóa một danh mục
exports.deleteCategory = (req, res) => {
    handleServiceRequest(res, async () => {
        const deleted = await categoryService.deleteCategory(req.params.id);
        return deleted ? null : false; // null để trả về 204 nếu xóa thành công
    }, 204);
};
