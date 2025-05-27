'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MediaFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MediaFile.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  MediaFile.init({
    product_id: DataTypes.INTEGER,
    file_url: DataTypes.STRING,
    file_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MediaFile',
  });
  return MediaFile;
};