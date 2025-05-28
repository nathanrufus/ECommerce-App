'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Brands', [
      { name: 'Nike', slug: 'nike', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Adidas', slug: 'adidas', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Puma', slug: 'puma', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', null, {});
  }
};
