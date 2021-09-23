const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const CampRouter = require('./routes/campgrounds'); 
const ReviewRouter = require('./routes/reviews')
const methods = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')



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

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));

app.get('/',(req,res) =>{
    res.render('home');
})

app.use('/campgrounds',CampRouter);
app.use('/campgrounds/:campid/reviews',ReviewRouter);

app.all('*',(req,res,next)=>{
    console.dir(req);
    next(new ExpressError("These arent the droids you are looking for!", 404))
})

app.use((err, req, res, next) => {
    console.dir(err);
    res.status(err.statusCode).send(err.message);
})

app.listen(8080,() =>{
    console.log("Port: 8080")
})