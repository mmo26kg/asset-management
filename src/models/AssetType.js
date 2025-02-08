const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const AssetType = sequelize.define('AssetType', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    color: { type: DataTypes.STRING, defaultValue: '#000000' },
    icon: { type: DataTypes.STRING, defaultValue: 'star' },
    type: {
        type: DataTypes.ENUM('property', 'receivable', 'payable'),
        allowNull: false,
        defaultValue: 'property',
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});

module.exports = AssetType;
