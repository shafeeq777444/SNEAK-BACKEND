const jwt =require('jsonwebtoken')
const generateAccessToken=(user)=>{
    return jwt.sign({id:user._id,email:user.email,role:user.role},process.env.jwt_access_key,{expiresIn:"1d"})
}
const generateRefreshToken=(user)=>{
    return jwt.sign({id:user._id,email: user.email,role:user.role },process.env.jwt_refresh_key,{expiresIn:"7d"})
}

module.exports={
    generateAccessToken,generateRefreshToken
}