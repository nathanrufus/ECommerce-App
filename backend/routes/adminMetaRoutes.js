const express = require('express');
const router = express.Router();
const controller = require('../controllers/metaController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { upload } = require('../utils/cloudinary');

// Admin-only creation routes
router.post('/categories', authMiddleware, roleMiddleware('admin'), upload.single('thumbnail'), controller.createCategory);
router.post('/brands', authMiddleware, roleMiddleware('admin'), controller.createBrand);
router.post('/tags', authMiddleware, roleMiddleware('admin'), controller.createTag);
// Admin-only delete routes
router.delete('/categories/:id', authMiddleware, roleMiddleware('admin'), controller.deleteCategory);
router.delete('/brands/:id', authMiddleware, roleMiddleware('admin'), controller.deleteBrand);


// Public fetch routes
router.get('/categories', controller.getCategories);
router.get('/brands', controller.getBrands);
router.get('/tags', controller.getTags);

module.exports = router;
