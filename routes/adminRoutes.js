const express = require('express');
const adminController = require('../controllers/adminController');
const verifyTokenByCookies = require('../middlewares/verifyTokenByCookies')
const verifyRole = require('../middlewares/verifyRole');
// const validateRequest = require('../middlewares/validateRequest');
// const { getProductsSchema, getProductByIdSchema } = require('../validators/adminValidators');
const upload = require('../middlewares/upload')


const router = express.Router();

// Admin authentication routes
router.post('/login',verifyTokenByCookies, verifyRole('admin'), adminController.login); // Admin login

// Admin user handling routes
router.get('/users', verifyTokenByCookies, verifyRole('admin'), adminController.getAllUsers); // Get all users
router.get('/users/:id', verifyTokenByCookies, verifyRole('admin'), adminController.getUserById);//Get specific user
router.patch('/users/:id', verifyTokenByCookies, verifyRole('admin'), adminController.deleteUser); // Delete a user


//Admin can CRUD PRODUCTS
// create
router.post('/products',verifyTokenByCookies,verifyRole('admin'),upload.array('image'),adminController.createProduct);
// Fetch all products with pagination and filtering
router.get('/products/all',verifyTokenByCookies,verifyRole('admin'),adminController.getAllProducts);
// Fetch specific product details
router.get('/products/:id',verifyTokenByCookies,verifyRole('admin'),adminController.getProductById);
// Update an existing product
router.patch('/products/:id',verifyTokenByCookies,verifyRole('admin'),adminController.updateProduct);
// Soft delete a product
router.delete('/products/:id',verifyTokenByCookies, verifyRole('admin'),adminController.deleteProduct
);

//Admin can accessible order details
router.get('/stats', verifyTokenByCookies, verifyRole('admin'), adminController.getStats);

router.get('/orders', verifyTokenByCookies, verifyRole('admin'), adminController.getOrders);

// specific user orde
// Route to get orders for a specific user
router.get("/orders/:userId",verifyTokenByCookies, verifyRole('admin'), adminController.getUserOrders);

// dashboard
router.get('/dashboard',verifyTokenByCookies, verifyRole('admin'), adminController.getDashboardDataServices);

router.put("/status/:id",verifyTokenByCookies, verifyRole('admin'), adminController.updateOrderStatusController);

module.exports = router;
