const mongoose=require('mongoose')
cartSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        size:{
            type:Number,
            required:true,
            // default:7
        },
        quantity:{
            type:Number,
            required:true,
            // default:1
        }
    }]
    
})
module.exports=mongoose.model('Cart',cartSchema,'carts')