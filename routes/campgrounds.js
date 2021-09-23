const express = require('express')
const Router = express.Router()
const WrapperAsync = require('../utils/WrapperAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campgroundmodel')
const mongoose = require('mongoose');
const {campgroundSchema} = require('../ValidationSchemas')

const ValidateCamp = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(err => err.message).join(',')
        throw new ExpressError(msg,404);
    }
    else
    next()
}

const ValidateId = function(req,res,next){
    if(mongoose.isValidObjectId(req.params.id))
    next();
    else{
        req.flash('error','Invalid campground Id');
        res.redirect('/campgrounds');
    }
}

Router.get('/',WrapperAsync(async (req,res,next) =>{
    const camps = await Campground.find({});
    res.render('campgrounds/index',{camps})
}))
Router.post('/', ValidateCamp,WrapperAsync( async (req,res) =>{
    const camp = new Campground(req.body.campground)
    await camp.save();
    const id = camp._id;
    res.redirect('/campgrounds/'+id)
}));

Router.get('/new',(req,res)=>{
    res.render('campgrounds/new');
});
    
Router.get('/:id', ValidateId ,WrapperAsync( async (req,res) =>{

    const id = req.params.id;
    let camp = await Campground.findById(id).populate('reviews');
    if(!camp){
        req.flash('error', 'Campground not found' )
    }
    res.render('campgrounds/details',{camp})

}));

Router.post('/:id',WrapperAsync( async (req,res) =>{
    const id = req.params.id;
    let camp = await Campground.findByIdAndUpdate(id,req.body.campground,{new:true});
    res.render('campgrounds/details',{camp})
}));

Router.delete('/:id',WrapperAsync( async (req,res) =>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

Router.get('/:id/edit',async (req,res) =>{
    const id = req.params.id;
    let camp = await Campground.findById(id);
    res.render('campgrounds/edit',{camp})
});


module.exports = Router;