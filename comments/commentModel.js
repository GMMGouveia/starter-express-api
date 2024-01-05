var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
    title: {
        type: String,
        required: [true, "A comment must have a title"]
    },
    description: {
        type: String,
        minlength: [5, "Description must be at least 10 characters long"],
        maxlength: [1000, "Description must be less than 100 characters long"]
    },
    rating: {
        type: Number,
        required:[true, "A comment must have a rating"],
        min: 1,
        max: 5
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: [true, "A comment must be associated with a product"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "A comment must be associated with a user"]
    },
    created: Date,
});

CommentSchema.pre(/^find/, function(next){
    this.populate({
        path:'product',
        select: 'title'
    }).populate({
        path: "user",
        select: 'firstName lastName -_id'
    })
    next();
})

module.exports = mongoose.model('Comment', CommentSchema);
    