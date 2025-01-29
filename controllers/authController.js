const asycHandler = require("../utils/asyncHandler");
const { registerUser, loginUser, LoggedInUserService } = require("../services/authService");
const authValidator = require("../validator/authValidator");
const CustomError = require("../utils/customError");
// @route   POST /register
// @desc    Register a new user
exports.register = asycHandler(async (req, res) => {
    const { value, error } = authValidator.registerValidatorSchema.validate(req.body);
    if (error) {
        throw new CustomError(error, 400); //if error occur throw is similiar to return that move to catch the below is not worked
    }
    const { name, email, password } = value; //req.body same output
    const user = await registerUser(name, email, password);
    res.status(201).json({ user });
});

// @route   POST /login
// @desc    Login user and return a JWT
exports.login = asycHandler(async (req, res) => {
    const { value, error } = authValidator.loginValidatorSchema.validate(req.body);
    if (error) {
        throw new CustomError(error, 400);
    }
    const { email, password } = value; //req.body same output
    // one response can be sent for a single request because of the HTTP protocol's request-response cycle.
    const { accessToken, refreshToken, user } = await loginUser(email, password);
    console.log(accessToken, 'new')

    // localStorage.set('accesToken', accessToken)
    
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


    res.status(200).json({ user });
});

exports.refreshTokenController = asycHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies
  
    if (!refreshToken) {
      throw new CustomError("Refresh token not found", 401);
    }
  
    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.jwt_refresh_key);
  
      // Generate a new access token
      const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email });
      

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true, // This makes the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === 'production', // Ensure the cookie is sent only over HTTPS in production
        maxAge: 15 * 60 * 1000, // Access token expiration time (15 minutes)
        sameSite: 'Strict', // Prevent CSRF attacks
      });

      // Send the new access token in the response
      console.log(newAccessToken)
      // Send a response confirming the new token is set
      
    res.status(200).json({ message: 'Access token refreshed successfully' });

    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new CustomError("Refresh token expired", 401);
      } else {
        throw new CustomError("Invalid refresh token", 401);
      }
    }
  });
  
  exports.LoggedUserController = asycHandler(async(req, res) => {
    
    const user = await LoggedInUserService(req.user.id); 
    if (!user) {
      throw new CustomError('User not found', 404);
    } 
    res.status(200).json({ user });
  }); 

  exports.logoutUser = (req, res) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
    });

    res.status(200).json({ message: 'Logged out successfully' });
}