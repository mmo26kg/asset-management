const Transaction = require('./Transaction');
const Account = require('./Account');
const Config = require('./Config');
const UserBalance = require('./UserBalance');
const Category = require('./Category');
const AssetType = require('./AssetType');
const User = require('./User');
const Stock = require('./Stock');
const Currency = require('./Currency');


// Khai báo các quan hệ
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

Category.belongsTo(AssetType, { foreignKey: 'assetTypeId' });
AssetType.hasMany(Category, { foreignKey: 'assetTypeId' });

Account.belongsTo(Category, { foreignKey: 'categoryId' });
Account.belongsTo(Stock, { foreignKey: 'stockId' });

module.exports = {
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
