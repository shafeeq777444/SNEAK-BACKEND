// middleware/errorHandler.js
const CustomError = require('../utils/customError');

const errorHandler = (err, req, res, next) => {
    let customError = err;

    if (err instanceof CustomError) {
        // Operational error (expected error from the application)
        customError.message = err.message || 'Something went wrong';
        customError.statusCode = err.statusCode || 500;
    } else {
        // Uncaught errors, programming mistakes, or unexpected errors
        // asyncHandler error worked in this
        customError = new CustomError('Internal Server Error', 500);
        console.error('Unexpected Error:', err); // Log the error for debugging
    }

    res.status(customError.statusCode).json({
        success: false,
        message: customError.message,
        // stack: process.env.NODE_ENV === 'production' ? null : customError.stack
    });
};

module.exports = errorHandler;
