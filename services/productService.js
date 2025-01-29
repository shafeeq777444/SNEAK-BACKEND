const Product = require("../model/Product");
const CustomError = require("../utils/customError");

// Get female products
exports.getFemaleAllProducts = async ({limit,skip}) => {
    
    const products = await Product.find({ sex: "female", isDeleted: false })
    .skip(skip)
    .limit(Number(limit));
    const totalProducts = await Product.countDocuments({ sex: "female", isDeleted: false });
    if (!products || !products.length) {
        throw new CustomError("No products found", 404);
    }
    return{products,totalProducts}  ;
};
// Get female products
exports.getMaleAllProducts = async ({limit,skip}) => {
    
    const products = await Product.find({ sex: "male", isDeleted: false })
    .skip(skip)
    .limit(Number(limit));
    const totalProducts = await Product.countDocuments({ sex: "male", isDeleted: false });
    if (!products || !products.length) {
        throw new CustomError("No products found", 404);
    }
    return{products,totalProducts}  ;
};
// Get all products
exports.fetchAllProducts = async ({limit,skip}) => {
    
    const products = await Product.find({ isDeleted: false }).skip(skip)
    .limit(Number(limit));
    const totalProducts = await Product.countDocuments({ isDeleted: false });
    console.log(products)
    if (!products || !products.length) {
        throw new CustomError("No products found", 404);
    }
    return {products,totalProducts} ;
};

// Get all products
exports.fetchSearchProducts = async () => {
    
    const products = await Product.find({ isDeleted: false })
    console.log(products)
    if (!products || !products.length) {
        throw new CustomError("No products found", 404);
    }
    return {products} ;
};

// Get products by category
exports.getProductsByCategory = async (categoryname) => {
    const categorizedProducts = await Product.find({ category: categoryname });
    if (!categorizedProducts || !categorizedProducts.length) {
        throw new CustomError(`No products found in category: ${categoryname}`, 404);
    }
    return categorizedProducts;
};

// Get products by category
exports.getProductsByGender = async (gender) => {
    const genderProducts = await Product.find({ sex: gender });
    if (!genderProducts || !genderProducts.length) {
        throw new CustomError(`No products found in category: ${genderProducts}`, 404);
    }
    return genderProducts;
};


// Get a single product by ID
exports.getProductById = async (id) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new CustomError("Product not found", 404);
    }
    return product;
};
