var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FullCardSchema = new Schema({
    owner:String,
    
});

module.exports = mongoose.model('FullCard', FullCardSchema);