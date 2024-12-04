const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const enumUtil = require('../utils/enumUtil'); // Import sequelize

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    transactionType: {
        type: DataTypes.ENUM(...Object.values(enumUtil.TransactionTypes).map(transactionType => transactionType.value))
    },
    name: { type: DataTypes.STRING, allowNull: false },
    // dateTime: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    note: { type: DataTypes.TEXT, defaultValue: '' },
    amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0.0 },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'VND' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});

module.exports = Transaction;
