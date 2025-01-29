const User = require("../model/User");
const Cart = require("../model/Cart");
const CustomError = require("../utils/customError");
const Product = require("../model/Product");
exports.addToCart = async (userId, addingProducts) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new CustomError("Please Login ", 400);
    }
    if (!addingProducts.length) {
        throw new CustomError("No adding products", 400);
    }
    
    // Add product to cart
    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
        cart = new Cart({
            userId: userId,
            products: addingProducts.map((product) => ({
                productId: product.productId,
                size: product.size,
                quantity: product.quantity,
            })),
        });
    } else {
        // Cart already exists for the user
        for (const addingProduct of addingProducts) {
            const product = await Product.findById(addingProduct.productId); // Fetch product to check stock
            if (!product) {
                throw new CustomError("Product not found", 400);
            }

            // Ensure the quantity added is not more than the stock
            const maxQuantity = Math.min(addingProduct.quantity, product.stock); // Use stock as limit
            if (maxQuantity <= 0) {
                // Skip adding product if quantity is less than or equal to 0
                continue;
            }

            addingProduct.quantity = maxQuantity;  // Update the quantity to the available stock

            let existedProduct = cart.products.find(
                (cartProduct) => cartProduct.productId.toString() === addingProduct.productId.toString()
            );

            if (existedProduct) {
                // If product exists in the cart, add quantity within available stock
                const newQuantity = existedProduct.quantity + addingProduct.quantity;
                if(newQuantity>product.stock){
                    throw new CustomError(`Stock availablity is less than ${newQuantity}`, 400);
                }
                existedProduct.quantity = Math.min(newQuantity, product.stock);  // Ensure it doesn't exceed stock
            } else {
                // If product is not in the cart, add it with the quantity within stock
                cart.products.push({ 
                    productId: addingProduct.productId,
                    size: addingProduct.size,
                    quantity: addingProduct.quantity 
                });
            }
        }
    }
    
    await cart.save();
    return { status: 200, message: "Cart updated successfully" };
};

exports.getCart = async (userId) => {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
        throw new CustomError("No cart found for the user", 400);
    }
    return cart;
};

exports.updateCartQuantityService = async ({userId,productId,size,updateQuantity}) => {
    const cart = await Cart.findOne({userId}).populate("products.productId");
    if (!cart) {
        throw new CustomError("No cart found for the user", 400);// Cart not found
      }
       const product=cart.products.find((x)=>x.productId._id.toString()==productId.toString() && x.size==size)
      
    if (!product) {
        throw new CustomError("No product found for the user", 400);// Product not found in the cart
      }
      //Validate stock
    const productDetails = await Product.findById(productId);
    if (!productDetails) {
        throw new CustomError("Product not found", 404);
    }
    if (productDetails.stock < product.quantity + updateQuantity) {
        throw new CustomError(
            `Insufficient stock  Available stock: ${productDetails.stock}`,
            400
        );
    }
    if (product.quantity + updateQuantity < 1) {
        throw new CustomError("Minimum quantity is crossed", 400);
    }

  
      // Update the quantity
      product.quantity += updateQuantity;
      await cart.save();
    return cart
    
};

exports.removeCartProductService = async ({ userId, productId, size }) => {
    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate("products.productId");;
    if (!cart) {
      throw new CustomError('Cart not found', 404); // Custom error handling
    }
  
    // Find the product in the cart and remove it based on productId and size
    const productIndex = cart.products.findIndex(
      (item) =>
        item.productId._id.toString() == productId.toString() && item.size == size
    );
  
    if (productIndex === -1) {
      throw new CustomError('Product not found in cart', 404);
    }
  
    // Remove the product from the array
    cart.products.splice(productIndex, 1);
  
    // Save the updated cart
    await cart.save();
  
    return cart;
  };
  