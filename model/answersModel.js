const mongoose = require('mongoose');

let answerschema = mongoose.Schema({
    text: {
        type: String,
    },
    question_id:{type:mongoose.Schema.ObjectId},
});

module.exports = mongoose.model('answers', answerschema);