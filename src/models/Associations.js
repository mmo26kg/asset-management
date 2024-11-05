const Transaction = require('./Transaction');
const Account = require('./Account');
const Config = require('./Config');
const UserBalance = require('./UserBalance');
const Category = require('./Category');
const AssetType = require('./AssetType');
const User = require('./User');
const Stock = require('./Stock');
const Currency = require('./Currency');

// Khai báo các quan hệ hiện tại
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

// Bổ sung các quan hệ mới

// Transaction và Account: Một giao dịch (transaction) sẽ thuộc về một tài khoản (account)
Account.hasMany(Transaction, { foreignKey: 'accountId' });
Transaction.belongsTo(Account, { foreignKey: 'accountId' });

// UserBalance với Account: Một UserBalance có thể thuộc về một tài khoản
UserBalance.belongsTo(Account, { foreignKey: 'accountId' });
Account.hasMany(UserBalance, { foreignKey: 'accountId' });

// UserBalance với Category: Một UserBalance có thể thuộc về một danh mục (category)
UserBalance.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(UserBalance, { foreignKey: 'categoryId' });

// UserBalance với AssetType: Một UserBalance có thể thuộc về một loại tài sản (asset type)
UserBalance.belongsTo(AssetType, { foreignKey: 'assetTypeId' });
AssetType.hasMany(UserBalance, { foreignKey: 'assetTypeId' });

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
