const Category = require('../models/Category');

// Lấy tất cả các danh mục
exports.getAllCategories = async () => {
    return await Category.findAll();
};

// Lấy một danh mục theo ID
exports.getCategoryById = async (id) => {
    return await Category.findByPk(id);
};

// Tạo mới một danh mục
exports.createCategory = async (data) => {
    return await Category.create(data);
};

// Cập nhật một danh mục theo ID
exports.updateCategory = async (id, data) => {
    const category = await Category.findByPk(id);
    if (!category) return null;
    await category.update(data);
    return category;
};

// Xóa một danh mục theo ID
exports.deleteCategory = async (id, isHardDelete = false) => {
    const category = await Category.findByPk(id);
    if (!category) return null;

    // Lưu dữ liệu của danh mục để trả về sau khi xóa
    const deletedCategory = category.get({ plain: true });
    
    if (isHardDelete) {
        // Hard delete: xóa hoàn toàn khỏi database
        await category.destroy({ force: true });
    } else {
        // Soft delete: chỉ ẩn đi mà không xóa hoàn toàn
        await category.destroy();
    }

    return deletedCategory; // Trả về đối tượng đã xóa
};
