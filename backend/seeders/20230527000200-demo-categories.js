'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      { name: 'Shoes', slug: 'shoes', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Apparel', slug: 'apparel', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Accessories', slug: 'accessories', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
