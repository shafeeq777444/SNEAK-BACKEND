const jwt = require('jsonwebtoken');
const { auth } = require('../config/config');

const verifyToken = (req, res, next) => {


    // Extract token from cookies
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.jwt_access_key);
        console.log("Decoded JWT payload:", decoded); // Debug decoded payload
        req.user = decoded; // Add user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

module.exports = verifyToken;
