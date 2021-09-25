const { string } = require('joi');
const mongoose = require('mongoose');
const passport = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type:String,
        required: true,
        unique:true
    }
});

UserSchema.plugin(passport);

module.exports =mongoose.model('User',UserSchema);