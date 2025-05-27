'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductTag.belongsToMany(models.Product, {
        through: 'ProductTagMap',
        foreignKey: 'tag_id'
      });
      
    }
  }
  ProductTag.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductTag',
  });
  return ProductTag;
};