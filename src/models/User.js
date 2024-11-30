const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const enums = require('../utils/enumUtil')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    membership: { 
        type: DataTypes.ENUM(...Object.values(enums.Memberships).map(membership => membership.value)), 
        defaultValue: 'basic' 
    },
    role: {
        type: DataTypes.ENUM(...Object.values(enums.Roles).map(role => role.value)), // Danh sách vai trò
        allowNull: false,
        defaultValue: 'member', // Giá trị mặc định
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});


module.exports = User;
