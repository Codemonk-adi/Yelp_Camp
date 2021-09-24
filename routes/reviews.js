const express = require('express');
const Router = express.Router({mergeParams:true});
const WrapperAsync = require('../utils/WrapperAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campgroundmodel');
const Review = require('../models/Reviewmodel')
const {reviewSchema} = require('../ValidationSchemas');  


const ValidateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(err => err.message).join(',')
        throw new ExpressError(msg,409);
    }
    else
    next()
}

Router.post('/',ValidateReview, WrapperAsync(async (req,res) =>{
    const campid= req.params.campid;
    const reviez = new Review(req.body.review);
    const camp = await Campground.findById(campid);
    camp.reviews.push(reviez);
    await reviez.save();
    await camp.save();
    req.flash('success', 'Review Successfully Created')
    res.redirect(`/campgrounds/${campid}`)

}))

Router.delete('/:reviewid',WrapperAsync(async (req,res) =>{
    const {campid,reviewid}= req.params
    await Campground.findByIdAndUpdate(campid, { $pull: {reviews : reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash('success', 'Review Successfully Deleted')

    res.redirect(`/campgrounds/${campid}`);
}))

module.exports = Router;