const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productSchema = new Schema({
    title:{
        type: String,
        require:[true, 'title is required'],
        unique: true,
        trim: true
    },
    description:{
        type: String,
        minLength:[10, 'Description must be at least 10 characters long'],
        maxLenght:[1000, 'Description must be less than 1000 characters long']
    },
    price:{
        type: Number,
        require:[true, 'Price is required'],
        min:[0, 'Price must be a positive number'],
        max:[1000000, 'Price must be at most 1000000']
    },

    created:{
        type: Date,
        default: Date.now
    },
    imageCover : {
        type: String,
        require:[true, 'Image is required']
    },
    images: [String],
    suppliers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        }
    ],
});

productSchema.pre('save', function(next){
    console.log('a product is being saved to the store');
    next();
});

productSchema.post('save', function(data,next){
    console.log('a product was saved to the store');
    next();
})

module.exports = mongoose.model('Products', productSchema);
