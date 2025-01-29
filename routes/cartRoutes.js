const express = require("express");
// const Product = require("../model/Product");

const verifyTokenByCookies = require("../middlewares/verifyTokenByCookies");
const router = express.Router();
const {
    addToCart,
    getCart,
    updateCartQuantityController,
    removeCartProductController,
} = require("../controllers/cartController");

router.post("/cart", verifyTokenByCookies, addToCart);

router.get("/cart", verifyTokenByCookies, getCart);

router.post("/cart/update", verifyTokenByCookies, updateCartQuantityController);

// DELETE request to remove a product from the cart
router.delete("/cart/remove", verifyTokenByCookies, removeCartProductController);

module.exports = router;
