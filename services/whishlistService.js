const Wishlist = require("../model/Whishlist");
const CustomError = require('../utils/customError');

// Add to Wishlist
exports.addToWishlist = async (userId, productId) => {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
        // Create new wishlist
        wishlist = new Wishlist({
            userId,
            products: [productId],
        });
        await wishlist.save();
        return "Product added to wishlist";
    } else {
        // Check if the product is already in the wishlist
    const productIndex = wishlist.products.indexOf(productId);
    if (productIndex === -1) {
        // Product is not in the wishlist, add it
        wishlist.products.push(productId);
        await wishlist.save();
        return "Product added to wishlist";
    } else {
        // Product is already in the wishlist, remove it
        wishlist.products.splice(productIndex, 1);
        await wishlist.save();
        return "Product removed from wishlist";
    }
    }
};

// Remove from Wishlist
exports.removeFromWishlist = async (userId, productId) => {
    const updatedWishlist = await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { products: productId } },
        { new: true }
    );

    if (!updatedWishlist) {
        throw new CustomError("Wishlist not found", 404);
    }

    return updatedWishlist;
};

// Get Wishlist
exports.getWishlist = async (userId) => {
    const wishlist = await Wishlist.findOne({ userId }).populate('products');

    if (!wishlist) {
        throw new CustomError("Wishlist not found", 404);
    }

    return wishlist;
};
