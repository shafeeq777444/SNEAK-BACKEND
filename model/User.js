// import mongoose  for database management in MongoDB.
// import bcrypt librabry for password hashing
// mongoDB is no sql
// so we create structure for user Data by using mongoose.Schema Constructor
// schema created for individual fields-------------------------------------------------------------------------------------------------------
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profileImg:{
        type:String
    },
    profileThumbImg:{ // Compressed version of profile image
        type:String
    },
    accountCreatedDate:{
        type:Date,
        default:()=>Date.now()
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define the possible roles
        default: 'user', // Default role is "user"
    },

})
// mongoose.Schema Constructor first parameter object commonly used key-value pairs
// type:String,
// required:true,
// unique:true,
// ------------------------------------------------------------------------------------------------------------------------------------------

// Hash the password before saving it to the database
// the previous password and current password have any difference
// they have't modified the hashing process not occur direct move to main operation (unaccesory hashing avoid)
// Generate a salt
// generate salt key with cost factor 10
//  combine password+salt and hashes 1024 times itself (the number we can changed by changing cost factor)
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
         next()
    }
    const salt= await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password,salt)
    next()
})
// Compare entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    // extract salt from stored hash password. and add salt +plain text password and its hashed and compare to already saved db password,this algorithum automatically extracted the salt
    return await bcrypt.compare(enteredPassword, this.password);
  };


module.exports=mongoose.model('User',userSchema,'Users')