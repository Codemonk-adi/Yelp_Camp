const Review = require('../models/Reviewmodel')
const Campground = require('../models/campgroundmodel');


module.exports.newReview = async (req,res) =>{
    const campid= req.params.campid;
    const reviez = new Review(req.body.review);
    reviez.author = req.user._id;
    const camp = await Campground.findById(campid);
    camp.reviews.push(reviez);
    await reviez.save();
    await camp.save();
    req.flash('success', 'Review Successfully Created')
    res.redirect(`/campgrounds/${campid}`)
}

module.exports.deleteReview = async (req,res) =>{
    const {campid,reviewid}= req.params
    await Campground.findByIdAndUpdate(campid, { $pull: {reviews : reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash('success', 'Review Successfully Deleted')
    res.redirect(`/campgrounds/${campid}`);
}