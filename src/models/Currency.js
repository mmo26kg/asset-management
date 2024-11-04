const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize

const Currency = sequelize.define('Currency', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    symbol: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true
});

module.exports = Currency;
