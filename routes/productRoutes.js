const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifyTokenByCookies = require('../middlewares/verifyTokenByCookies')

// Route to get all products
router.get("/product/female",  productController.getFemaleAllProducts);
router.get("/product/male",  productController.getMaleAllProducts);
router.get("/products",  productController.getAllProducts);
router.get("/products/search",  productController.getSearchProducts);

// Route to get products by category
router.get("/product/category/:categoryname", verifyTokenByCookies, productController.getProductsByCategory);

// Route to get products by Gender
router.get("/product/gender/:gender",  productController.getProductsByGender);


// Route to get a single product by ID
router.get("/product/:id",  productController.getProductById);

module.exports = router;
