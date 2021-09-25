const express = require('express');
const Router = express.Router();
const User = require('../models/Usermodel');
const WrapperAsync = require('../utils/WrapperAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/Reviewmodel')
const mongoose = require('mongoose');
const {UserSchema} = require('../ValidationSchemas')
const passport = require('passport');
const ValidateUser = function (req, res, next) {
    const { error } = UserSchema.validate(req.body);
    if(error){
        const msg = error.details.map(err => err.message).join(',')
        throw new ExpressError(msg,404);
    }
    else
    next()
}

Router.get('/register',(req,res)=>{
    res.render('users/register');
})

Router.post('/register', ValidateUser, async (req,res) =>{
    try{
    const {username,password,email} = req.body;
    const user = new User({username , email});
    const saved = await User.register(user, password);
    req.flash('success',`Successfully Registered ${user.username}`);
    res.redirect('/campgrounds')
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
})

Router.get('/login',(req,res)=>{
    res.render('users/login');
})

Router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}) ,(req,res)=>{
    req.flash('success', 'Successfully Logged in!')
    res.redirect('/campgrounds');
})

Router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Goodbye!');
    res.redirect('/campgrounds');
})
module.exports = Router;