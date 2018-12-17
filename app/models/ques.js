var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Questions = new Schema({
    user_id: {type: String, required: true},
    question: {type: String, required: true, unique: true, minlength: 10},
    date: {type: String, required: true},
    answers : {type:Array, default:[]}
    // answers: [{
    //     user_id: {type: String},
    //     answer: {type: String, minlength: 5},
    //     upVotes: {type: Array, default: []},
    //     downVotes: {type: Array, default: []},
    //     date: {type: String}
    // }]
});

module.exports = mongoose.model('Questions', Questions);

