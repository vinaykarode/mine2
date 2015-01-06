var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BackCardSchema = new Schema({
    fullcardid:String,
    backcardtext:{type:String, default:''},
    backcardimage:{type:String, default:''},
    backcardsound:{type:String, default:''},
});

module.exports = mongoose.model('BackCard', BackCardSchema);