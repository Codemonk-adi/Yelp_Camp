
const { func } = require('joi');
const mongoose = require('mongoose');
const Review = require('./Reviewmodel');

const campGroundSchema = new mongoose.Schema({
    title:String,
    location:String,
    price:Number,   
    description:String,
    image:String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'review'
        }
    ]
}) 

campGroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        if(doc.reviews){
            for (let review of doc.reviews){
                await Review.findByIdAndDelete(review);
            } 
        }
    }

})
module.exports = mongoose.model('Campground',campGroundSchema);