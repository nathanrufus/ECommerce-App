console.log('▶️ Starting database sync...');

require('dotenv').config();
console.log('🌐 DB URL:', process.env.DB_URL);  // Debug .env load

const db = require('./models');

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection established.');

    await db.sequelize.sync({ alter: true }); // or force: true
    console.log('✅ All tables created successfully.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error syncing the database:', err);
    process.exit(1);
  }
})();
