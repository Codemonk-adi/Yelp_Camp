const User = require('../models/Usermodel');


module.exports.registerUser = async (req,res) =>{
    try{
    const {username,password,email} = req.body;
    const user = new User({username , email});
    const saved = await User.register(user, password);
    req.login(saved,(err)=>{
        if(err) return next(err);
        req.flash('success',`Successfully Registered ${user.username}`);
        const redirectUrl = req.session.returnTo || '/campgrounds'
        res.redirect(redirectUrl);
            
    })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

module.exports.registerForm = (req,res)=>{
    res.render('users/register');
}

module.exports.loginForm = (req,res)=>{
    res.render('users/login');
}

module.exports.loginUser = (req,res)=>{
    req.flash('success', 'Successfully Logged in!')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; 
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res)=>{
    req.logout();
    req.flash('success','Goodbye!');
    res.redirect('/campgrounds');
}