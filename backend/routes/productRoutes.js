// /routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { upload } = require('../utils/cloudinary');

// Admin routes
router.post('/products', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), productController.createProduct);
router.put('/products/:id', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), productController.updateProduct);
router.delete('/products/:id', authMiddleware, roleMiddleware('admin'), productController.deleteProduct);

// Public routes
router.get('/products', productController.getAllProducts);
router.get('/products/id/:id', productController.getProductById); 
router.get('/products/category/:slug', productController.getProductsByCategory);

router.get('/products/:slug', productController.getProductBySlug);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);

module.exports = router;