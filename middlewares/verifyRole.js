const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        console.log("User from token:", req.user); // Log req.user to debug
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

module.exports = verifyRole;
