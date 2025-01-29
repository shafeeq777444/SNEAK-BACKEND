const mongoose = require('mongoose');

// Define product schema
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Name is required"], // Custom error message
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"] // Validation for positive numbers
    },
    oldPrice: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"] // Validation for positive numbers
    },
    sex: {
        type: String,  
        required: true, 
      },
    image: {
        type: [String],  // Array of strings (image URLs)
        required: [true, "Image URL is required"],
    },
    stock:{
        type:Number,
        required:true
    },
    
    isDeleted: {
        type: Boolean,
        default: false
    },
    
}, { timestamps: true }); // Enable timestamps for createdAt and updatedAt

module.exports = mongoose.model('Product', productSchema);
