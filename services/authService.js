const User = require('../model/User')
const jwt=require('jsonwebtoken')
const {auth}=require('../config/config')
const CustomError =require('../utils/customError'); //keep capital for class name
const { generateRefreshToken, generateAccessToken } = require('../utils/jwtUtils');
// Register a new user----------------------------------------------------------------------------------------------------------------
exports.registerUser = async (name, email, password,role='user') => {
    let user = await User.findOne({ email });
    if (user) {
        throw new CustomError("Email already exists",400);
    }
    // creates a new document instance of the User model based on the schema.(instance create dont want variable scoped)
    user = new User({ name, email, password,role });
    await user.save();
    return user ;
};
exports.loginUser=async(email,password)=>{
    let user = await User.findOne({email ,isDeleted:false})
    if(!user){
        // json middle ware convert this js object to json
        throw new CustomError("invalid user",404);
    }
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new CustomError("incorrect password",401);
    }
    // generate jwt Token---------------------------------------
  const refreshToken=generateRefreshToken(user)
  const accessToken=generateAccessToken(user)
    return {refreshToken,accessToken,user}
}

exports.LoggedInUserService = async (id) => {
    const user = await User.findById(id).select('name _id email role');
    return user;
};