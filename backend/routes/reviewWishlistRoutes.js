const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewWishlistController');
const authMiddleware = require('../middleware/authMiddleware');

// Reviews
router.post('/reviews', authMiddleware, controller.createReview);
router.get('/products/:id/reviews', controller.getReviewsForProduct);

// Wishlist
router.post('/wishlist', authMiddleware, controller.addToWishlist);
router.get('/wishlist', authMiddleware, controller.getWishlist);
router.delete('/wishlist/:product_id', authMiddleware, controller.removeFromWishlist);

module.exports = router;