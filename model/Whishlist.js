const mongoose=require('mongoose')
const User=require('./User')
const whishlistSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        }]
})
module.exports=mongoose.model('Whishlist',whishlistSchema)