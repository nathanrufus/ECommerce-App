'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const products = [
      { name: 'MacBook Pro 14"', description: 'Apple M2 Pro', price: 1999.99, category_id: 1, brand_id: 1 },
      { name: 'Dell XPS 13', description: '13-inch ultrabook', price: 1299.99, category_id: 1, brand_id: 2 },
      { name: 'HP Envy 15', description: 'Mid-range laptop', price: 899.99, category_id: 1, brand_id: 2 },
      
      { name: 'Dell 24" Monitor', description: 'Full HD IPS Monitor', price: 179.99, category_id: 2, brand_id: 2 },
      { name: 'LG UltraWide 29"', description: 'WFHD UltraWide Monitor', price: 299.99, category_id: 2, brand_id: 1 },
      
      { name: 'Anker USB-C Charger', description: 'Fast charging 65W', price: 49.99, category_id: 3, brand_id: 1 },
      { name: 'Apple 96W Adapter', description: 'Official Apple charger', price: 79.99, category_id: 3, brand_id: 1 },
      
      { name: 'Logitech MX Master 3', description: 'Premium wireless mouse', price: 99.99, category_id: 4, brand_id: 2 },
      { name: 'Razer BlackWidow Keyboard', description: 'Mechanical RGB keyboard', price: 149.99, category_id: 4, brand_id: 2 },
      
      { name: 'Samsung SSD 1TB', description: 'Portable USB SSD', price: 109.99, category_id: 4, brand_id: 1 },
      { name: 'Belkin USB Hub', description: '7-port USB 3.0 hub', price: 39.99, category_id: 4, brand_id: 2 },
      { name: 'Monitor Stand', description: 'Adjustable metal stand', price: 29.99, category_id: 4, brand_id: 1 },
      { name: 'Cooling Pad', description: 'Laptop cooler with fans', price: 24.99, category_id: 4, brand_id: 2 },
      { name: 'Laptop Sleeve', description: 'Padded case 15"', price: 19.99, category_id: 4, brand_id: 1 },
      { name: 'Webcam 1080p', description: 'USB Full HD Webcam', price: 59.99, category_id: 4, brand_id: 2 }
    ].map(p => ({ ...p, createdAt: now, updatedAt: now }));

    await queryInterface.bulkInsert('Products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
