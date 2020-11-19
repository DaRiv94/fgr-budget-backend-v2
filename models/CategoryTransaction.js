const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../db/sequelize");

class CategoryTransaction extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }

};
CategoryTransaction.init({
  category_id: DataTypes.INTEGER,
  transaction_id: DataTypes.INTEGER,
  user_id: DataTypes.STRING
}, {
  sequelize,
  modelName: 'CategoryTransaction',
});

module.exports = CategoryTransaction;

