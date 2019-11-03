const mongoose = require('mongoose');

let questionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    },
    category: {
        type: String //must use  _id but for know i am taking it static string
    },
    description: {
        type: String
    },
    tags: {
        trim: true,
        type: Array
    },
    // askedby: { type: mongoose.Types.ObjectId },
    askedby: { type: String },

    upvotes: {
        type: Number
    },
    upvotes: {
        type: Number
    },
    views: {
        type: Number,
        default: 0
    },
    flag: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: new require('moment')().valueOf()
    }
});
questionSchema.set('toJSON', {
    virtuals: true
});
questionSchema.set('toObject', {
    virtuals: true
});
questionSchema.virtual('answers', {
    ref: "answers",
    localField: "_id",
    foreignField: "question_id"
})
questionSchema.virtual('totalanswers', {
    ref: "answers",
    localField: "_id",
    foreignField: "question_id",
    count: true
})
// questionSchema.virtual('isAnswered').get(function(){
// if(this.answers.length>0) return 1
// return 0
// })
module.exports = mongoose.model('questions', questionSchema);