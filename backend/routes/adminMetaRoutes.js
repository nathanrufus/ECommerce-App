const express = require('express');
const router = express.Router();
const controller = require('../controllers/metaController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin-only creation routes
router.post('/categories', authMiddleware, roleMiddleware('admin'), controller.createCategory);
router.post('/brands', authMiddleware, roleMiddleware('admin'), controller.createBrand);
router.post('/tags', authMiddleware, roleMiddleware('admin'), controller.createTag);

// Public fetch routes
router.get('/categories', controller.getCategories);
router.get('/brands', controller.getBrands);
router.get('/tags', controller.getTags);

module.exports = router;
