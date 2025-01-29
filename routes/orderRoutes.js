const express = require("express");
const { placeOrderController,  verifyPaymentController, updateOrderStatus, updateOrderStatusController, getOrders, orderGraphController } = require("../controllers/orderController");
const verifyTokenByCookies = require('../middlewares/verifyTokenByCookies')
const router = express.Router();

// placeOrder routes
router.post("/order", verifyTokenByCookies, placeOrderController);
router.post('/verifypayment',verifyTokenByCookies, verifyPaymentController);

router.get("/orders", getOrders);
// router.get("/order", verifyTokenByCookies, verifyPaymentController);

// Express route
router.get('/api/weekly-sales', orderGraphController);

module.exports = router;
