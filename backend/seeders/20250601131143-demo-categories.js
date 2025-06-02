'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      { name: 'Laptops', slug: 'laptops', parent_id: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Monitors', slug: 'monitors', parent_id: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Chargers', slug: 'chargers', parent_id: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Accessories', slug: 'accessories', parent_id: null, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
