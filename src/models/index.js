// Import sequelize từ file config/database
const { sequelize } = require('../config/database');

// Import các models
const Transaction = require('./Transaction');
const Account = require('./Account');
const Config = require('./Config');
const UserBalance = require('./UserBalance');
const Category = require('./Category');
const AssetType = require('./AssetType');
const User = require('./User');
const Stock = require('./Stock');
const Currency = require('./Currency');



// Thiết lập các quan hệ giữa các mô hình
const setupAssociations = () => {
    User.hasMany(Transaction, { foreignKey: 'userId' });
    Transaction.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(Account, { foreignKey: 'userId' });
    Account.belongsTo(User, { foreignKey: 'userId' });

    Account.belongsTo(Currency, { foreignKey: 'currencyId' });
    Currency.hasMany(Account, { foreignKey: 'currencyId' });

    User.hasOne(Config, { foreignKey: 'userId' });
    Config.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(UserBalance, { foreignKey: 'userId' });
    UserBalance.belongsTo(User, { foreignKey: 'userId' });

    Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parentId' });
    Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });

    Category.belongsTo(AssetType, { foreignKey: 'assetTypeId', as: 'assetType' });
    AssetType.hasMany(Category, { foreignKey: 'assetTypeId' });

    Account.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
    Account.belongsTo(Stock, { foreignKey: 'stockId' });

    Account.hasMany(Transaction, { foreignKey: 'accountId' });
    Transaction.belongsTo(Account, { foreignKey: 'accountId' });

    UserBalance.belongsTo(Account, { foreignKey: 'accountId', as: "account" });
    Account.hasMany(UserBalance, { foreignKey: 'accountId' });

    UserBalance.belongsTo(Category, { foreignKey: 'categoryId', as: "category" });
    Category.hasMany(UserBalance, { foreignKey: 'categoryId' });

    UserBalance.belongsTo(AssetType, { foreignKey: 'assetTypeId', as: "assetType" });
    AssetType.hasMany(UserBalance, { foreignKey: 'assetTypeId' });
};

// Thiết lập các quan hệ
setupAssociations();

// Export các models và sequelize để sử dụng trong ứng dụng
module.exports = {
    sequelize,
    Transaction,
    Account,
    Config,
    UserBalance,
    Category,
    AssetType,
    User,
    Stock,
    Currency
};
