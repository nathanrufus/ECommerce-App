'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: passwordHash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: passwordHash,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
