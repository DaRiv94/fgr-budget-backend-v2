const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../db/sequelize");


class Budget extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
};
Budget.init({
  name: DataTypes.STRING,
  budget_max: DataTypes.DOUBLE,
  budget_real: DataTypes.DOUBLE,
  category_id: DataTypes.INTEGER,
  user_id: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Budget',
});

module.exports = Budget