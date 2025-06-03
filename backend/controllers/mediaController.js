const MediaFile = require('../models/mediafile');
const { cloudinary } = require('../utils/cloudinary');

exports.deleteMediaFile = async (req, res) => {
  try {
    const media = await MediaFile.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    // Delete from Cloudinary using saved public_id
    if (media.public_id) {
      await cloudinary.uploader.destroy(media.public_id);
    }

    // Delete from MongoDB
    await MediaFile.findByIdAndDelete(req.params.id);

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ message: 'Server error while deleting image' });
  }
};
