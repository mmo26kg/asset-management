const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const Config = sequelize.define('Config', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    currency: { type: DataTypes.STRING, defaultValue: 'VND' },
    themeColor: { type: DataTypes.STRING, defaultValue: '#FFFFFF' },
    language: { type: DataTypes.STRING, defaultValue: 'vi' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});

module.exports = Config;
