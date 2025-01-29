const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const UserBalance = sequelize.define('UserBalance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    balanceType: {
        type: DataTypes.ENUM('account', 'category', 'assetType', 'asset'),
        allowNull: false,
        defaultValue: 'account',
    },
    balance: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0.0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});

module.exports = UserBalance;
