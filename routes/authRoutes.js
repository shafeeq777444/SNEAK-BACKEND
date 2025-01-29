const express=require('express')
const {register,login, refreshTokenController, LoggedUserController, logoutUser } =require('../controllers/authController')
const verifyToken = require('../middlewares/verifyTokenByCookies')
const router=express.Router()


router.post('/register',register)
router.post('/login',login)
router.post('/refresh-token',refreshTokenController)
router.get('/me',verifyToken, LoggedUserController);
router.get('/logout',logoutUser)
module.exports=router;