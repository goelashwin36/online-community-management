var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostedArticles = new Schema({
    topic: String,
    article: String,
    date: String
});

module.exports = mongoose.model('Articles', PostedArticles);
