// server.js
const app = require('./app');
const { sequelize } = require('./models'); // Adjust if using Sequelize default export

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate(); // Test DB connection
    console.log(' Connected to PostgreSQL database.');

    await sequelize.sync(); // Optional: sync models
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
})();
