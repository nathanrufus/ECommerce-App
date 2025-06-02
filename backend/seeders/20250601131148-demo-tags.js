'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductTags', [
      { name: 'New', slug: 'new', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Featured', slug: 'featured', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductTags', null, {});
  }
};
