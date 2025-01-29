const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    
    totalPrice: {
        type: Number,
        required: true,
    },
    totalItems: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentId:{type:String},
    expectedDeliveryDate: {
        type: Date,
        default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
    shippingAddress: {
        address: { type: String, },
        pincode: { type: Number,  },
        phoneNumber: { type: Number,  },
    },
    status: { type: String, enum: ['placed', 'shipped', 'delivered', 'pending', 'cancelled'] },
    razorpayOrderId: {
      type: String, // Store the Razorpay order ID here
    },
    razorpayPaymentId: {
      type: String, // Store the Razorpay payment ID here
    },
    razorpayPaymentStatus: {
      type: String, // Store the Razorpay payment status (paid/failed) here
      enum: ['paid', 'failed', 'pending', 'captured', 'refunded'],
      default: 'pending',
    },
},{ timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
