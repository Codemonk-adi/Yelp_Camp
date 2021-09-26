const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    rating: Number,
    body: String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

});

module.exports = mongoose.model('review', reviewSchema);