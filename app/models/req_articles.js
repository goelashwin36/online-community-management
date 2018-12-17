var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RequestArticle = new Schema({
    user_id: String,
    description: {type: String, minlength: 10}
});


module.exports = mongoose.model('Request', RequestArticle);
