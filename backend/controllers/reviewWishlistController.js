const Review = require('../models/review');
const Wishlist = require('../models/wishlist');
const Product = require('../models/product');

// =======================
// REVIEWS
// =======================

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
      product_id,
      customer_id: req.user.id
    });

    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = new Review({
      product_id,
      customer_id: req.user.id,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating review' });
  }
};

exports.getReviewsForProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product_id: req.params.id })
      .populate({ path: 'customer_id', select: 'name email' })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// =======================
// WISHLIST
// =======================

exports.addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;

    const exists = await Wishlist.findOne({
      customer_id: req.user.id,
      product_id
    });

    if (exists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const wishlist = new Wishlist({
      customer_id: req.user.id,
      product_id
    });

    await wishlist.save();

    res.status(201).json({ message: 'Added to wishlist', wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ customer_id: req.user.id })
      .populate({
        path: 'product_id',
        populate: [{ path: 'brand_id' }, { path: 'category_id' }]
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

    await Wishlist.deleteOne({
      customer_id: req.user.id,
      product_id
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};
