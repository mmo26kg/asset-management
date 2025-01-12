const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.0 },
    note: { type: DataTypes.TEXT, defaultValue: '' },
    share: { type: DataTypes.INTEGER, defaultValue: 0 },
    price: { type: DataTypes.FLOAT, defaultValue: 0.0 },
    rate: { type: DataTypes.FLOAT, defaultValue: 1.0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});

module.exports = Account;
