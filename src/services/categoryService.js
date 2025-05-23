const { Category, AssetType } = require('../models');
const deleteUtil = require('../utils/deleteUtil');


// Lấy tất cả các danh mục
exports.getAllCategories = async (queryConditions, listOptions) => {
    const result = await Category.findAndCountAll({
        where: {
            ...queryConditions,
            ...listOptions.whereCondition,
        },
        order: [[listOptions.sortBy, listOptions.sortOrder]],
        limit: listOptions.perpage,
        offset: listOptions.offset,
        include: [
            {
                model: AssetType,
                as: 'assetType',
                // attributes: ['id', 'name', 'icon']
            }
        ]
    });

    return {
        totalResults: result.count,
        totalPages: Math.ceil(result.count / listOptions.perpage),
        currentPage: listOptions.page,
        perPage: listOptions.perpage,
        data: result.rows,
    };
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
exports.deleteCategory = async (id, option, checkDetail) => {
    const constraints = deleteUtil.CategoryDeleteConstraint;
    return await deleteUtil.deleteService(Category, id, constraints, option, checkDetail);
};
