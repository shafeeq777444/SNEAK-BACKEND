const { razorpayInstance } = require("../config/razorpay");
const Cart = require("../model/Cart");
const Order = require("../model/Order");
const Product = require("../model/Product");
const CustomError = require("../utils/customError");

// exports.placeOrderService=async(userId,products,totalPrice,totalItems,orderId)=>{

//         const newOrder=new Order({
//             userId,
//             products,
//             totalPrice,
//             totalItems,
//             orderId
//         })
//         await newOrder.save()
//         return newOrder
// }
// Create Order
// exports.placeOrderService = async ({products,totalPrice,totalItems,userId, shippingAddress, paymentMethod}) => {
//     // Fetch and validate cart
//     const cart = await Cart.findOne({ userId }).populate("products.productId");
//     if (!cart || cart.products.length === 0) {
//         throw new CustomError("Your cart is empty.", 400);
//     }
exports.placeOrderService = async ({totalPrice,userId}) => {
  // Fetch and validate cart
  const cart = await Cart.findOne({ userId }).populate("products.productId");
  if (!cart || cart.products.length === 0) {
      throw new CustomError("Your cart is empty.", 400);
  }


    // // Prepare order items and validate stock
    // for (const cartItem of cart.items) {
    //     const product = cartItem.productId;
    //     if (!product) throw new CustomError("Product not found.", 404);

    //     if (product.stock < cartItem.quantity || product.isDeleted) {
    //         throw new CustomError(`Insufficient stock or deleted product: ${product.name}`, 400);
    //     }
    //     totalAmount += product.price * cartItem.quantity;
    //     orderItems.push({ productId: product._id, quantity: cartItem.quantity });

        // // Reduce stock
        // product.stock -= cartItem.quantity;
        // await product.save();
    
    // Create the order in the database
//   const order = await new Order({
//     userId,
//     products:cart.products,
//     shippingAddress,
//     paymentMethod,
//     totalPrice,
//     totalItems,
//     status: paymentMethod === 'razorpay' ? 'pending' : 'placed',
//   }).save();
// //   cart.products = [];
//   await cart.save();

  // Handle Razorpay payment if selected
  // if (paymentMethod === 'razorpay') {
    const options = {
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      receipt: `order_receipt_${Date.now()}`,
      payment_capture: 1,
    };

    // Create order with Razorpay
    try {
      const razorpayOrder = await razorpayInstance.orders.create(options);
      

      return {razorpayOrder };
    } catch (error) {
        console.log(error)
      throw new CustomError('Razorpay order creation failed', 500);
    }
  }


// Verify Payment
// exports.verifyPaymentServices = async ({paymentId,address,userId}) => {
//     const cart = await Cart.findOne({ userId }).populate('products.productId');
    
  
//     try {
//       // Fetch payment details from Razorpay
//       const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
  
//       if (paymentDetails.status === 'captured') {
//         // Create a new order using the cart items
//         const newOrder = new Order({
//           userId,
//           products: cart.products.map(item => ({
//             productId: item.productId._id,
//             quantity: item.quantity,
//             price: item.productId.price,
//           })),
//           totalPrice: cart.products.reduce((total, item) => total + (item.productId.price * item.quantity), 0),
//           totalItems: cart.products.length,
//           paymentMethod: 'razorpay',
//           paymentId:paymentId,
//           razorpayPaymentStatus: 'paid',
//           status: 'placed',
//           shippingAddress: address,  // Update with actual shipping address from user profile
//         });
  
//         // Save the order
//         await newOrder.save();
//   console.log("its captured")
//         // Clear the cart after order is placed
//         cart.products = [];
//         await cart.save();
  
//         // Return the new order
//         return { success: true ,order:newOrder};
//         // return { success: true, order: newOrder };
//       } else {
//         throw new CustomError("Payment not captured", 400);
//       }
//     } catch (error) {
//       console.error(error);
//       throw new CustomError(error.message || "Internal Server Error", 500);
//     }
//   };

// // // Get User Orders Service
// // exports.getUserOrderService = async (userId) => {
// //     if (!userId) {
// //         throw new CustomError("User ID is required to fetch orders", 400);
// //     }

// //     const orders = await Order.find({ userId }).populate("products.productId");

// //     if (!orders || orders.length === 0) {
// //         throw new CustomError("No orders found for this user", 404);
// //     }

// //     return orders;
// // };
exports.verifyPaymentServices = async ({ paymentId, address, userId }) => {
  const cart = await Cart.findOne({ userId }).populate('products.productId');
  
  try {
    // Fetch payment details from Razorpay
    const paymentDetails = await razorpayInstance.payments.fetch(paymentId);

    if (paymentDetails.status === 'captured') {
      // Create a new order using the cart items
      const newOrder = new Order({
        userId,
        products: cart.products.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        })),
        totalPrice: cart.products.reduce((total, item) => total + (item.productId.price * item.quantity), 0),
        totalItems: cart.products.length,
        paymentMethod: 'razorpay',
        paymentId: paymentId,
        razorpayPaymentStatus: 'paid',
        status: 'placed',
        shippingAddress: address, // Update with actual shipping address from user profile
      });

      // Save the order
      await newOrder.save();
      console.log("Order captured and saved");

      // Reduce stock for each product in the order
      for (let item of cart.products) {
        const product = await Product.findById(item.productId._id);
        if (product) {
          product.stock -= item.quantity; // Decrease the stock by the ordered quantity
          if (product.stock < 0) {
            throw new CustomError(`Insufficient stock for product ${product.name}`, 400);
          }
          await product.save(); // Save the updated product
        } else {
          throw new CustomError(`Product not found for ID ${item.productId._id}`, 400);
        }
      }

      // Clear the cart after the order is placed
      cart.products = [];
      await cart.save();

      // Return the new order
      return { success: true, order: newOrder };
    } else {
      throw new CustomError("Payment not captured", 400);
    }
  } catch (error) {
    console.error(error);
    throw new CustomError(error.message || "Internal Server Error", 500);
  }
};


exports.getPaginatedOrders = async (page, limit) => {
  try {
    const startIndex = (page - 1) * limit;

    const orders = await Order.find().populate("products.productId")
      .skip(startIndex)
      .limit(limit)
      .exec();

    const totalOrders = await Order.countDocuments();

    return {
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new Error("Error fetching orders: " + error.message);
  }
};

const moment = require('moment'); // Use moment.js for date manipulation

exports.getWeeklySalesDataService = async () => {
  try {
    // Get the current date and the date 7 days ago
    const endDate = moment().endOf('day').toDate();
    const startDate = moment().subtract(7, 'days').startOf('day').toDate();

    // Aggregate orders within the last 7 days
    const weeklySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $unwind: '$products',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $group: {
          _id: '$products.productId',
          totalSales: { $sum: '$products.quantity' },
          productName: { $first: '$productDetails.productName' },
        },
      },
    ]);

    return weeklySales.map((sale) => ({
      productId: sale._id,
      productName: sale.productName ? sale.productName[0] : 'Unknown Product',
      totalSales: sale.totalSales,
    }));
  } catch (error) {
    throw new Error('Error fetching weekly sales data: ' + error.message);
  }
};