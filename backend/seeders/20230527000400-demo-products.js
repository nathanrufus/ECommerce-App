'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const products = [];

    for (let i = 1; i <= 10; i++) {
      products.push({
        name: `Product ${i}`,
        slug: `product-${i}`,
        description: `Description for Product ${i}`,
        short_desc: `Short description ${i}`,
        meta_title: `Meta Title ${i}`,
        meta_description: `Meta Description ${i}`,
        price: (i + 1) * 10,
        category_id: (i % 3) + 1,
        brand_id: (i % 3) + 1,
        createdAt: now,
        updatedAt: now
      });
    }

    await queryInterface.bulkInsert('Products', products);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
