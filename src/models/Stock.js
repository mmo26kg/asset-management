const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const Stock = sequelize.define('Stock', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    stockSymbol: { type: DataTypes.STRING, unique: true, allowNull: false },
    market: { type: DataTypes.STRING, defaultValue: 'NYSE' },
    currentPrice: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});

module.exports = Stock;
