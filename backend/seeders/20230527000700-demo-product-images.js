'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const media = [];

    for (let i = 1; i <= 10; i++) {
      media.push({
        product_id: i,
        file_url: `https://via.placeholder.com/600x400?text=Product+${i}`,
        file_type: 'image',
        createdAt: now,
        updatedAt: now
      });
    }

    await queryInterface.bulkInsert('MediaFiles', media);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MediaFiles', null, {});
  }
};
