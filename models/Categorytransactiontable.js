'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryTransactionTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.belongsToMany(Transaction, { through: CategoryTransactionTable });
      Transaction.belongsToMany(Category, { through: CategoryTransactionTable });
    }
  };
  CategoryTransactionTable.init({
    CategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category, // 'Movies' would also work
        key: 'id'
      }
    },
    TransactionId: {
      type: DataTypes.INTEGER,
      references: {
        model: Transaction, // 'Actors' would also work
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'CategoryTransactionTable',
  });
  return CategoryTransactionTable;
};



const CategoryTransactionTable = sequelize.define('CategoryTransactionTable', {

});
