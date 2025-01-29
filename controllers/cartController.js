const asycHandler = require('../utils/asyncHandler')
const { addToCart, getCart, updateCartQuantityService, removeCartProductService } = require("../services/cartService");
exports.addToCart = asycHandler (async (req, res) => {
    const userId = req.user.id;
    const { addingProducts } = req.body;
        const result = await addToCart(userId, addingProducts);
        res.status(result.status).json(result.message);
});

exports.getCart = asycHandler (async (req, res) => {
    const userId = req.user.id;
        const result = await getCart(userId);
        res.json(result);
});

exports.updateCartQuantityController = asycHandler (async (req, res) => {
    const userId = req.user.id;
    const { productId,updateQuantity,size } = req.body;
    const result = await updateCartQuantityService({ userId,productId,size,updateQuantity });
    res.json(result);
});


exports.removeCartProductController = asycHandler(async (req, res) => {
    console.log(req.body,"helo")
    const userId = req.user.id; // Assuming userId is extracted from JWT
    const { productId, size } = req.body;
  
    if (!productId || !size) {
      res.status(400);
      throw new Error('Product ID and size are required');
    }
  
    // Call the service to remove the product
    const updatedCart = await removeCartProductService({ userId, productId, size });
  
    // Respond with the updated cart
    res.json(updatedCart);
  });
  