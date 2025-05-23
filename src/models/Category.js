const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const categoryHook = require('../hooks/categoryHook');
const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    icon: { type: DataTypes.STRING, defaultValue: 'star' },
    isStock: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    hooks: {
        beforeCreate: async (category, options) => {
            categoryHook.validateCategoryConstraints(category);
        },
        beforeUpdate: async (category, options) => {
            categoryHook.validateCategoryConstraints(category);
        }
    }

});

module.exports = Category;
