const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../db/sequelize");

class Bank extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
};

Bank.init({
  item_id: DataTypes.STRING,
  access_token: DataTypes.STRING,
  user_id: DataTypes.STRING,
  institution_name: DataTypes.STRING

}, {
  sequelize,
  modelName: 'Bank',
});

module.exports = Bank;
