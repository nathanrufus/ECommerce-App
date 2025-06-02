const app = require('./app');
const connectDB = require('./config/db'); // MongoDB connection function

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(); // Connect to MongoDB Atlas
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
})();
