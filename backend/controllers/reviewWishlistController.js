const { Review, Wishlist, Product } = require('../models');

//  REVIEWS
exports.createReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Optional: prevent duplicate reviews
    const existing = await Review.findOne({
      where: {
        product_id,
        customer_id: req.user.id
      }
    })

    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      product_id,
      customer_id: req.user.id,
      rating,
      comment
    });

    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating review' });
  }
};

exports.getReviewsForProduct = async (req, res) => {
  try {
    const reviews = await Review.findAll({ where: { product_id: req.params.id } });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// ✅ WISHLIST
exports.addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const exists = await Wishlist.findOne({
      where: { customer_id: req.user.id, product_id }
    });
    if (exists) return res.status(400).json({ message: 'Product already in wishlist' });

    const wishlist = await Wishlist.create({
      customer_id: req.user.id,
      product_id
    });
    res.status(201).json({ message: 'Added to wishlist', wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { customer_id: req.user.id },
      include: [Product]
    });
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { product_id } = req.params;
    await Wishlist.destroy({ where: { customer_id: req.user.id, product_id } });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};