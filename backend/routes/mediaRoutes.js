const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.delete(
  '/media/:id',
  authMiddleware,
  roleMiddleware('admin'),
  mediaController.deleteMediaFile
);

module.exports = router;
