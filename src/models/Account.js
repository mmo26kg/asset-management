const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0.0 },
    note: { type: DataTypes.TEXT, defaultValue: '' },
    image: { type: DataTypes.STRING, defaultValue: '' },
    isStock: { type: DataTypes.BOOLEAN, defaultValue: false },
    share: { type: DataTypes.INTEGER },
    price: { type: DataTypes.FLOAT },
    rate: { type: DataTypes.FLOAT },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});

module.exports = Account;
