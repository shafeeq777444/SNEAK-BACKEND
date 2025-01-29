const adminService = require("../services/adminService");
const asyncHandler = require("../utils/asyncHandler"); // Import asyncHandler
const adminValidator = require("../validator/adminValidator");
const CustomError = require("../utils/customError");
const Order = require("../model/Order");
const User = require("../model/User");
const Product = require("../model/Product");
// Admin login
exports.login = asyncHandler(async (req, res) => {
    const { value, error } = adminValidator.loginValidatorSchema.validate(req.body);
    if (error) {
        throw new CustomError(error, 400);
    }
    const { email, password } = value;
    const { accessToken, refreshToken, admin  } = await adminService.adminLogin(email, password);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',
        maxAge:7*24*60*60*1000
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // This makes the cookie inaccessible to JavaScript
        secure: true,
        maxAge: 1*24*60*60*1000, // Access token expiration time (15 minutes)
        sameSite: "none", // Prevent CSRF attacks
        path: '/'
    });


    res.status(200).json({ admin });
});

// Get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const users = await adminService.fetchAllUsers({startIndex,limit});
    res.json({
        currentPage: page,
        users,
      });
    })

// Get specific user
exports.getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id; // Extract user ID from the route params
    const user = await adminService.getUserById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Return user details
});

// toggle Delete a user
exports.deleteUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    console.log(id,"worked")
    const result = await adminService.removeUser(id);
    res.status(200).json({ message: "  successfully", result });
});

// CRUD PRODUCTS

// Create a new product
exports.createProduct = asyncHandler(async (req, res) => {
    console.log(req.files,"files")
    console.log(req.body,"bocy")
    const productData = req.body;
    if (req.files && Array.isArray(req.files)) {
        productData.image = req.files.map(x=>x.path)
      } 
      else{
        productData.image=[];
      }

    const newProduct = await adminService.createProduct(productData);
    res.status(201).json({ message: "Product created successfully", product: newProduct });
});

// Read Products
// Fetch all products with pagination and category filtering
exports.getAllProducts = asyncHandler(async (req, res) => {
    const { category, page = 1, limit = 0 } = req.query;
    const products = await adminService.fetchProducts({ category, page, limit });
    res.status(200).json(products);
});

// Fetch specific product by ID
exports.getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await adminService.fetchProductById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
});

// Update an existing product
exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const updatedProduct = await adminService.updateProduct(id, updates);
    if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
});

// Soft delete a product
exports.deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const allProduct = await adminService.softDeleteProduct(id);
    
    res.status(200).json({ allProduct });
});

// Order Details

exports.getStats = asyncHandler(async (req, res) => {
    const stats = await adminService.calculateStats();
    res.status(200).json({
        status: "SUCCESS",
        message: "Stats fetched successfully",
        data: stats,
    });
});

// getAllOrders
exports.getOrders = asyncHandler(async (req, res) => {
    const orders = await adminService.getAllOrders();
    res.status(200).json({
        status: "SUCCESS",
        message: "Orders fetched successfully",
        data: orders,
    });
});

exports.getUserOrders = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Call the service to get user orders
        const orders = await adminService.getUserOrders(userId);

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        res.status(200).json({  orders });
    } catch (error) {
        console.error("Error in getUserOrders controller:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Your service layer focuses on business logic, and the controller uses asyncHandler to handle errors automatically.
// dashboard
exports.getDashboardDataServices = async (req, res) => {
    try {
        // Total Sale (total sales amount)
        const totalSale = await Order.aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$totalPrice" } } }
        ]);

        // Total Users
        const users = await User.countDocuments();

        // Total Admins
        const admins = await User.find({ role: "admin" });

        // Selling Products (best-selling product details with name)
        const bestSellingProductData = await Order.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.productId",
                    totalSold: { $sum: "$products.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 1 }, // Fetching only the top-selling product
            {
                $lookup: {
                    from: "products", // Name of the Product collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    totalSold: 1,
                    productName: { $arrayElemAt: ["$productDetails.productName", 0] } // Extract product name
                }
            }
        ]);

        // Extract the best-selling product or set to default if no result
        const bestSellingProduct = bestSellingProductData.length > 0
            ? bestSellingProductData[0]
            : { _id: null, totalSold: 0, productName: "N/A" };

        // Total Products Sold (as a single value)
        const totalProductsSoldData = await Order.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: null,
                    totalSold: { $sum: "$products.quantity" }
                }
            }
        ]);

        const totalProductsSold = totalProductsSoldData.length > 0
            ? totalProductsSoldData[0].totalSold
            : 0;

        // All products in stock
        const allProducts = await Product.countDocuments({ isDeleted: false });

        return res.json({
            totalSale: totalSale[0] ? totalSale[0].totalAmount : 0,
            users,
            admins,
            bestSellingProduct,
            totalProductsSold,
            allProducts
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching dashboard data", error });
    }
};


exports.updateOrderStatusController = async (req, res) => {
    const { id } = req.params; // Order ID from URL
    const { status } = req.body; // New status from request body
  
    try {
        const updatedOrder = await adminService.updateOrderStatusService(id, status);
        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
  };