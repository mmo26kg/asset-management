const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    membership: { type: DataTypes.STRING, defaultValue: 'basic' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true

});

module.exports = User;
