const productService = require("../services/productService");
const asyncHandler = require("../utils/asyncHandler"); // Import asyncHandler

// Get female products
exports.getFemaleAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 8 } = req.query; // Default values: page 1, 8 products per page
    const skip = (page - 1) * limit;
    const { products, totalProducts } = await productService.getFemaleAllProducts({ page, limit, skip });

    res.status(200).json({
        womenProducts: products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: Number(page),
    });
});

// Get male products
exports.getMaleAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 8 } = req.query; // Default values: page 1, 8 products per page
    const skip = (page - 1) * limit;
    const { products, totalProducts } = await productService.getMaleAllProducts({ page, limit, skip });

    res.status(200).json({
        menProducts: products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: Number(page),
    });
});

// Get all products
exports.getAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 8 } = req.query;
    const skip = (page - 1) * limit;

    const { products, totalProducts } = await productService.fetchAllProducts({ page, limit, skip });

    res.status(200).json({
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: Number(page),
    });
});

// Get all products
exports.getSearchProducts = asyncHandler(async (req, res) => {
   

    const { products } = await productService.fetchSearchProducts();

    res.status(200).json({
        products
    });
});
// Get products by category
exports.getProductsByCategory = asyncHandler(async (req, res) => {
    const { categoryname } = req.params;
    const categorizedProducts = await productService.getProductsByCategory(categoryname);
    if (!categorizedProducts.length) {
        return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ categorizedProducts });
});

// Get products by category
exports.getProductsByGender = asyncHandler(async (req, res) => {
    const { gender } = req.params;
    const genderProducts = await productService.getProductsByGender(gender);
    if (!genderProducts.length) {
        return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ genderProducts });
});

// Get a single product by ID
exports.getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
});
