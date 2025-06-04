'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, delete all existing categories
    await queryInterface.bulkDelete('Categories', null, {});

    // Then insert your updated categories
    await queryInterface.bulkInsert('Categories', [
      { name: 'Laptops', slug: 'laptops', parent_id: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'CPUs', slug: 'cpus', parent_id: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Mouse', slug: 'mouse', parent_id: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Phone', slug: 'phone', parent_id: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'iPhone', slug: 'iphone', parent_id: null, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
