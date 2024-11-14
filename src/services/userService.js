const { User } = require('../models');

// Lấy tất cả người dùng dựa trên các điều kiện tìm kiếm
exports.getAllUsers = async (queryConditions) => {
    return await User.findAll({
        where: queryConditions
    });
};

// Lấy một người dùng theo ID
exports.getUserById = async (id) => {
    return await User.findByPk(id);
};

// Tạo mới một người dùng
exports.createUser = async (data) => {
    return await User.create(data);
};

// Cập nhật một người dùng theo ID
exports.updateUser = async (id, data) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(data);
    return user;
};

// Xóa một người dùng theo ID
exports.deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return true;
};
