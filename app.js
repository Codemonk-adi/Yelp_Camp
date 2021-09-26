const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const CampRouter = require('./routes/campgrounds'); 
const ReviewRouter = require('./routes/reviews')
const UserRouter = require('./routes/users');
const methods = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const session = require('express-session');
const flash = require('express-flash');
const passportLocal = require('passport-local');
const passport = require('passport');
const User = require('./models/Usermodel');


const favicon = path.join( __dirname,'favicon.ico');
const connect  = mongoose.connect('mongodb://localhost:27017/Yelp')
const db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error'));
db.once('open',()=>{
    console.log('Database Connected');
})

const app = express();

app.engine('ejs',ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methods('_method'));
app.use(express.static('public'));

const sessionConfig = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    SameSite : 'strict'
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));

app.get('/',(req,res) =>{
    res.render('home');
})
app.get('/favicon.ico',(req,res)=>{
    res.sendFile(favicon);
})
app.use('/', UserRouter);
app.use('/campgrounds',CampRouter);
app.use('/campgrounds/:campid/reviews',ReviewRouter);

app.all('*',(req,res,next)=>{
    // console.dir(req);
    next(new ExpressError("These arent the droids you are looking for!", 404))
})

app.use((err, req, res, next) => {
    console.dir(err);
    res.render('error',{err});
})

app.listen(8080,() =>{
    console.log("Port: 8080")
})