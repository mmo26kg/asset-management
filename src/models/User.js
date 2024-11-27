const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    membership: { type: DataTypes.STRING, defaultValue: 'basic' },
    role: {
        type: DataTypes.ENUM('member', 'admin', 'system_admin'), // Danh sách vai trò
        allowNull: false,
        defaultValue: 'member', // Giá trị mặc định
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});


User.modelInfo = {
    name: 'User',  // Tên của model
    description: 'Đại diện cho người sử dụng hệ thống.',  // Mô tả model
    vi: {
        capitalize: 'Người Dùng',  // Tên dạng Capitalize cho tiếng Việt
        upper: 'NGƯỜI DÙNG',  // Tên dạng Uppercase cho tiếng Việt
        normalize: 'người dùng',  // Tên chuẩn hóa
    },
    en: {
        capitalize: 'User',  // Tên dạng Capitalize cho tiếng Anh
        upper: 'USER',  // Tên dạng Uppercase cho tiếng Anh
        normalize: 'user',  // Tên chuẩn hóa
    },
    aliases: ['nguoidung', 'user'],  // Các tên gọi khác (ví dụ: viết tắt)
    plural: 'Users',  // Dạng số nhiều
    singular: 'User',  // Dạng số ít
};




module.exports = User;
