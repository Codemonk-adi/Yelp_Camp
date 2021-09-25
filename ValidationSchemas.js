const Joi = require('joi');

const campgroundSchema = Joi.object({

    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        description:Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})

const UserSchema = Joi.object({
    username: Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().required() 
})
module.exports = {campgroundSchema,reviewSchema, UserSchema};  