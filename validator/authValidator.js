const joi=require('joi')
const registerValidatorSchema=joi.object({
    name:joi.string().min(3).max(30).required(), //Joi.string(), it returns a Joi schema object , so we can use chain method
    email:joi.string().email().required(),
    password:joi.string().min(4).required()
})

const loginValidatorSchema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(4).required()
})

module.exports={
    registerValidatorSchema,
    loginValidatorSchema
}