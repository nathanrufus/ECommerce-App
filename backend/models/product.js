'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });
      Product.belongsTo(models.Brand, { foreignKey: 'brand_id' });
      Product.hasMany(models.Review, { foreignKey: 'product_id' });
      Product.hasMany(models.MediaFile, { foreignKey: 'product_id' });
      Product.belongsToMany(models.ProductTag, {
        through: 'ProductTagMap',
        foreignKey: 'product_id'
      });

    }
  }
  Product.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.TEXT,
    short_desc: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    stock_quantity: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    brand_id: DataTypes.INTEGER,
    meta_title: DataTypes.STRING,
    meta_description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};