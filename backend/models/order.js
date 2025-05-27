'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'customer_id' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });

    }
  }
  Order.init({
    customer_id: DataTypes.INTEGER,
    order_date: DataTypes.DATE,
    status: DataTypes.STRING,
    total_amount: DataTypes.DECIMAL,
    shipping_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};