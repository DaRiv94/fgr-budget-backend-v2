const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../db/sequelize");


class Transaction extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Account.hasMany(Transaction);
    Transaction.belongsTo(Account);
  }
};

Transaction.init({
  account_id: DataTypes.STRING,
  amount: DataTypes.DOUBLE,
  name: DataTypes.STRING,
  category_id: DataTypes.STRING,
  date: DataTypes.DATE,
  pending: DataTypes.BOOLEAN,
  transaction_id: DataTypes.STRING,
  transaction_type: DataTypes.STRING,
  user_id: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'Transaction',
});

module.exports = Transaction