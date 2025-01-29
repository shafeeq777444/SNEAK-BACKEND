const Admin = require('../model/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Product = require('../model/Product');
const Order = require('../model/Order');
const CustomError = require('../utils/customError'); // Import CustomError class
const { generateRefreshToken, generateAccessToken } = require('../utils/jwtUtils');

// Admin login
const adminLogin = async (email, password) => {
    console.log(email)

    const admin = await User.findOne({ email, role: 'admin' }); // Ensure the user is an admin
    if (!admin) {
        throw new CustomError('Admin not found', 404);
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new CustomError('Incorrect password', 401);
    }

    // Generate JWT
    const refreshToken=generateRefreshToken(admin)
  const accessToken=generateAccessToken(admin)
    return {refreshToken,accessToken,admin}

};

// Fetch all users (excluding admins)
const fetchAllUsers = async ({startIndex,limit}) => {
    return await User.find({ role: 'user' }).skip(startIndex).limit(limit);;
};

// Get specific user
const getUserById = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new CustomError("User not found", 404); // Error for non-existing user
    }

    if (user.isDeleted) {
        throw new CustomError("User is deleted", 404); // Error for soft-deleted user
    }

    return user; // Return the user object if valid
};

// toggle Delete a user
const removeUser = async (id) => {
    const user = await User.findById(id);

    if (!user) {
        throw new CustomError('User not found', 404); // User not found
    }

    if (user.role === 'admin') {
        throw new CustomError('Cannot delete an admin user', 400); // Cannot delete admin
    }

    // Soft delete user
    user.isDeleted = !user.isDeleted;
   const updatedUser=await user.save();

    return { id, message: `User has been marked as deleted ${user.isDeleted}`,user:updatedUser };
};

// CRUD PRODUCTS

// Create a new product
const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

// Fetch paginated products with category filtering
const fetchProducts = async ({ category, page, limit }) => {
    const query = {};
    if (category) {
        query.category = category; // Add category filter
    }

    const skip = (page - 1) * limit;

    const products = await Product.find()
         // Pagination logic

    const totalProducts = await Product.countDocuments(query); // Total count for pagination

    return {
        totalProducts,
        totalPages: 1,
        currentPage: Number(1),
        products,
    };
};

// Fetch specific product by ID
const fetchProductById = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new CustomError('Product not found', 404); // Product not found
    }
    if (product.isDeleted) {
        throw new CustomError('This product has been soft-deleted and cannot be displayed.', 400); // Custom error for soft-deleted product
    }
    return product;
};

// Update an existing product
const updateProduct = async (id, updates) => {
    // Perform the update
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    });

    return updatedProduct;
};

// Soft delete a product (mark isDeleted as true)
const softDeleteProduct = async (id) => {
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
        throw new CustomError('Product not found', 404); // Product not found
    }

    // Toggle the isDeleted value
    product.isDeleted = !product.isDeleted;

    // Save the updated product
    await product.save();
    const allproduct = await Product.find();

    return allproduct;
};

// Order details

const calculateStats = async () => {
    const totalProductsSold = await Order.aggregate([
        { $unwind: '$products' },
        { $group: { _id: null, total: { $sum: '$products.quantity' } } },
    ]);

    const totalRevenue = await Order.aggregate([
        { $unwind: '$products' },
        {
            $group: {
                _id: null,
                revenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
            },
        },
    ]);

    return {
        totalProductsSold: totalProductsSold[0]?.total || 0,
        totalRevenue: totalRevenue[0]?.revenue || 0,
    };
};

const getAllOrders = async () => {
    const orders = await Order.find().populate('userId').populate('products.productId');
    return orders;
};

const getUserOrders = async (userId) => {
    try {
        // Find orders where userId matches
        const orders = await Order.find({ userId }).populate("products.productId"); // Populate product details if needed
        return orders;
    } catch (error) {
        console.error("Error in getUserOrders service:", error);
        throw new Error("Failed to fetch user orders.");
    }
};
const updateOrderStatusService = async (orderId, status) => {
    const validStatuses = ["placed", "shipped", "delivered", "pending", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
    }
  
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true } // Returns the updated document
    );
  
    if (!updatedOrder) {
        throw new Error("Order not found");
    }
  
    return updatedOrder;
  };
module.exports = {
    updateOrderStatusService,
    adminLogin,
    fetchAllUsers,
    removeUser,
    getUserById,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    softDeleteProduct,
    calculateStats,
    getAllOrders,
    getUserOrders
};
