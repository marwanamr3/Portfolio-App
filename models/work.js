var mongoose = require('mongoose');
var config = require('../config/database');

//Work Schema
var WorkSchema = mongoose.Schema({
    username: String,
    picture: String,
    title:String,
    URL:String,
    screenshot:String
})

var Work = module.exports = mongoose.model('work', WorkSchema);



  