const express = require('express');
const router = express.Router();
const controller = require('../controllers/searchController');

router.get('/filter/products', controller.filterProducts);
router.get('/search', controller.searchProducts);

module.exports = router;
