
const { func } = require('joi');
const mongoose = require('mongoose');
const Review = require('./Reviewmodel');

const imageSchema = new mongoose.Schema({
    url:String,
    filename:String
})

imageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload','/upload/w_200');
})

const campGroundSchema = new mongoose.Schema({
    title:String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location:String,
    price:Number,   
    description:String,
    images:[
        imageSchema
    ],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
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