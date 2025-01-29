const { json } = require("express")
const { getUserOrderService, placeOrderService, verifyPaymentServices, updateOrderStatusService, getPaginatedOrders, getWeeklySalesDataService } = require("../services/orderService")
const asyncHandler =require('../utils/asyncHandler')

exports.placeOrderController = asyncHandler(async (req, res) => {
  const {totalPrice,} = req.body;
  console.log(totalPrice)
  const userId = req.user.id;
  console.log(userId)
  const { razorpayOrder } = await placeOrderService({totalPrice,userId});
  res.status(201).json({
    message: 'Order created successfully',
    razorpayOrder,
  });
});


//   Verify Payment 
exports. verifyPaymentController = asyncHandler(async (req, res) => {
    const { paymentId ,address} = req.body;
    console.log({paymentId,address},"checking verify")
    const userId = req.user.id;
      const isPaymentVerified = await verifyPaymentServices({paymentId,address,userId});
      res.json({isPaymentVerified})
})


// Controller to handle fetching paginated orders
exports. getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const paginatedOrders = await getPaginatedOrders(page, limit);

    res.status(200).json(paginatedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.orderGraphController=async (req, res) => {
  try {
    const data = await getWeeklySalesDataService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}