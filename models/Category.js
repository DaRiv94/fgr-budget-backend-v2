const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../db/sequelize");
const Transaction = require('./Transaction')
const CategoryTransaction = require('./CategoryTransaction')

class Category extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
};
Category.init({
  color: DataTypes.STRING,
  name: DataTypes.STRING,
  user_id: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Category',
});

module.exports = Category