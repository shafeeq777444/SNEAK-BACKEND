const wishlistService = require('../services/whishlistService');
const asyncHandler = require('../utils/asyncHandler'); // Import asyncHandler

// Add to Wishlist
exports.addToWishlist = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const productId = req.body.productId;

    const result = await wishlistService.addToWishlist(userId, productId);
    res.status(200).json({ message: result });
});

// Remove from Wishlist
exports.removeFromWishlist = asyncHandler(async (req, res) => {
    const userId = req.user.userid;
    const productId = req.body.productId;

    const updatedWishlist = await wishlistService.removeFromWishlist(userId, productId);

    if (!updatedWishlist) {
        return res.status(400).json({ message: "Wishlist not found" });
    }

    res.status(200).json({ wishlist: updatedWishlist });
});

// Get Wishlist
exports.getWishlist = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const wishlist = await wishlistService.getWishlist(userId);

    if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
});
