var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FrontCardSchema = new Schema({
    fullcardid:String,
    frontcardtext:{type:String, default:''},
    frontcardimage:{type:String, default:''},
    frontcardsound:{type:String, default:''},
});

module.exports = mongoose.model('FrontCard', FrontCardSchema);