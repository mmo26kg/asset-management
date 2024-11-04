const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, defaultValue: 'default-icon' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});

module.exports = Category;
