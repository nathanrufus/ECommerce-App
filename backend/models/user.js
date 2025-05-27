'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A User (customer) can have many Orders, Reviews, and Wishlists
      User.hasMany(models.Order, { foreignKey: 'customer_id' });
      User.hasMany(models.Review, { foreignKey: 'customer_id' });
      User.hasMany(models.Wishlist, { foreignKey: 'customer_id' });
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'customer'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
