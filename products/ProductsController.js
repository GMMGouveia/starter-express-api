const mongoose = require('mongoose');
var productSchema = require('./ProductsModel');

//get all
exports.getAllProducts = function(req, res, next){
    productSchema.find({}).then((product)=>{
        res.status(200).json(product)
    })
    .catch((err)=>{
        res.status(400).send(err);
    })
};

//get by ID
exports.getProductByID = function (req, res, next){
    let id = req.params.id;
    productSchema.findById(id).then((product)=>{
        res.status(200).json(product);
    })
    .catch((err)=>{
        res.status(400).send(err);
    })
};

//create product
exports.createProduct = function(req, res, next){
    let product = req.body;
    let newProduct = new productSchema(product);

    newProduct.save().then((data)=>{
      res.status(201).json(data)
    })
    .catch((err)=>{
        res.status(400).send(err);
    })
};

//update product
exports.updateProduct = function(req, res, next){
    let id = req.params.id;
    let product = req.body;

    productSchema.findByIdAndUpdate(id, product).then((data)=>{
        res.status(200).json(data)
    })
    .catch((err)=>{
        res.status(400).send(err);
    })
};

//delete by ID
exports.deleteProductById = function(req, res, next){
    let id = req.params.id;

    productSchema.findByIdAndDelete(id).then((data)=>{
        res.status(200).json(data)
    })
    .catch((err)=>{
        res.status(400).send(err);
    })
};

// populate

exports.getProductByID = function(req, res, next){
    let id = req.params.id;
    productSchema.find({_id:id}).populate({
        path: "suppliers",
        select: '-password -passwordChangedAt -passwordResetToken'
    }
    ).then(function(data){
        res.status(200).json({
            status: "success",
            data: data
        })
    }).catch(function(err){
        res.status(400).json({
            status: "fail",
            message: 'error' +err
        })
    })
    
}
